def extract_structure(files):
    structure = []
    for item in files:
        path = item.get("path") or item.get("name")
        item_type = item.get("type")

        if not path or not item_type:
            continue

        normalized = {
            "name": path,
            "type": item_type,
        }

        if item_type == "file" and isinstance(item.get("size"), int):
            normalized["size"] = item["size"]

        structure.append(normalized)

    structure.sort(key=lambda entry: (entry["type"] != "dir", entry["name"].lower()))
    return structure


def build_repo_stats(structure):
    total_items = len(structure)
    total_files = 0
    total_dirs = 0
    total_submodules = 0
    total_size_bytes = 0
    extension_counts = {}
    top_level_dirs = {}

    for entry in structure:
        item_type = entry.get("type")
        name = entry.get("name", "")

        if item_type == "file":
            total_files += 1
            total_size_bytes += entry.get("size", 0)

            if "." in name.rsplit("/", 1)[-1]:
                ext = "." + name.rsplit(".", 1)[-1].lower()
            else:
                ext = "other"
            extension_counts[ext] = extension_counts.get(ext, 0) + 1
        elif item_type == "dir":
            total_dirs += 1
        elif item_type == "submodule":
            total_submodules += 1

        first_segment = name.split("/", 1)[0] if name else ""
        if first_segment:
            top_level_dirs[first_segment] = top_level_dirs.get(first_segment, 0) + 1

    top_extensions = sorted(
        (
            {"extension": ext, "count": count}
            for ext, count in extension_counts.items()
        ),
        key=lambda item: item["count"],
        reverse=True,
    )[:10]

    top_folders = sorted(
        (
            {"name": folder, "count": count}
            for folder, count in top_level_dirs.items()
        ),
        key=lambda item: item["count"],
        reverse=True,
    )[:10]

    return {
        "total_items": total_items,
        "total_files": total_files,
        "total_dirs": total_dirs,
        "total_submodules": total_submodules,
        "total_size_bytes": total_size_bytes,
        "top_extensions": top_extensions,
        "top_folders": top_folders,
    }