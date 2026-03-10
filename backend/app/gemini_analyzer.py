import google.generativeai as genai
from .config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)


def _resolve_model_name():
    preferred = GEMINI_MODEL or "models/gemini-2.0-flash"
    fallback_candidates = [
        "models/gemini-2.0-flash",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro",
    ]

    try:
        models = list(genai.list_models())
        capable_models = [
            model.name
            for model in models
            if "generateContent" in getattr(model, "supported_generation_methods", [])
        ]

        if preferred in capable_models:
            return preferred

        for candidate in fallback_candidates:
            if candidate in capable_models:
                return candidate

        for model_name in capable_models:
            if "flash" in model_name.lower():
                return model_name

        if capable_models:
            return capable_models[0]
    except Exception:
        pass

    return preferred


model = genai.GenerativeModel(_resolve_model_name())


def _detect_stack(structure):
    names = [item.get("name", "") for item in structure]
    lowered = [name.lower() for name in names]

    stack = []
    if any(name.endswith(".py") for name in lowered):
        stack.append("Python")
    if any(name.endswith(".js") or name.endswith(".jsx") for name in lowered):
        stack.append("JavaScript/React")
    if any(name.endswith(".ts") or name.endswith(".tsx") for name in lowered):
        stack.append("TypeScript")
    if "dockerfile" in lowered:
        stack.append("Docker")
    if "requirements.txt" in lowered:
        stack.append("pip requirements")
    if "package.json" in lowered:
        stack.append("npm")

    return stack or ["Unknown (insufficient file signal)"]


def _summarize_structure(structure, max_paths=220):
    paths = [item.get("name", "") for item in structure if item.get("name")]
    sample_paths = paths[:max_paths]
    return "\n".join(sample_paths)


def _build_analysis_context(repo_stats, structure):
    extensions = repo_stats.get("top_extensions", [])
    extension_text = ", ".join(
        f"{item['extension']}({item['count']})" for item in extensions[:12]
    ) or "none"

    folders = repo_stats.get("top_folders", [])
    folder_text = ", ".join(
        f"{item['name']}({item['count']})" for item in folders[:12]
    ) or "none"

    return (
        f"Total entries: {repo_stats.get('total_items', 0)}\n"
        f"Files: {repo_stats.get('total_files', 0)}\n"
        f"Directories: {repo_stats.get('total_dirs', 0)}\n"
        f"Submodules: {repo_stats.get('total_submodules', 0)}\n"
        f"Total file size (bytes): {repo_stats.get('total_size_bytes', 0)}\n"
        f"Top extensions: {extension_text}\n"
        f"Top folders by entry count: {folder_text}\n"
        "Sample paths from full repository:\n"
        f"{_summarize_structure(structure)}"
    )


def _fallback_analysis(readme, structure, reason, repo_stats):
    condensed_reason = " ".join(str(reason).split())
    if len(condensed_reason) > 220:
        condensed_reason = condensed_reason[:217] + "..."

    total_items = repo_stats.get("total_items", len(structure))
    total_dirs = repo_stats.get("total_dirs", 0)
    total_files = repo_stats.get("total_files", 0)
    dirs = [item for item in structure if item.get("type") == "dir"]
    top_dirs = ", ".join(item.get("name", "") for item in dirs[:6]) or "None"
    stack = ", ".join(_detect_stack(structure))

    top_extensions = repo_stats.get("top_extensions", [])
    extension_line = ", ".join(
        f"{item['extension']} ({item['count']})" for item in top_extensions[:8]
    ) or "No file extension data"

    readme_preview = (readme or "").strip().splitlines()
    readme_summary = readme_preview[0][:180] if readme_preview else "README not available"

    return (
        "Fallback analysis generated locally (Gemini unavailable).\n\n"
        f"Reason: {condensed_reason}\n\n"
        "1. Project summary\n"
        f"- Full repository entries scanned: {total_items} ({total_files} files, {total_dirs} folders).\n"
        f"- Likely stack: {stack}.\n"
        f"- Top extensions: {extension_line}.\n"
        f"- README preview: {readme_summary}.\n\n"
        "2. Architecture explanation\n"
        f"- Folder layout suggests module separation: {top_dirs}.\n"
        "- Insights are derived from recursive repository file inventory.\n\n"
        "3. Improvement suggestions\n"
        "- Add/expand README with setup, architecture, and API contract details.\n"
        "- Add tests and CI checks for reliability.\n"
        "- Improve error handling and typed response contracts.\n\n"
        "4. Possible bugs\n"
        "- Missing or malformed environment variables can break runtime behavior.\n"
        "- External API limits (GitHub/Gemini) can cause partial or failed analysis.\n"
    )


def analyze_project(readme, structure, repo_stats):
    analysis_context = _build_analysis_context(repo_stats, structure)
    prompt = f"""
    Analyze this Github project.
    
    README:
    {readme}
    REPOSITORY CONTEXT (generated from full recursive tree):
    {analysis_context}

    Provide:
    
    1. Project summary
    2. Architecture explanation
    3. Improvement suggestions
    4. Possible bugs
    """

    if not GEMINI_API_KEY:
        return _fallback_analysis(readme, structure, "GEMINI_API_KEY is not set", repo_stats)

    try:
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if text:
            return text
        return _fallback_analysis(readme, structure, "Gemini returned an empty response", repo_stats)
    except Exception as exc:
        return _fallback_analysis(readme, structure, str(exc), repo_stats)