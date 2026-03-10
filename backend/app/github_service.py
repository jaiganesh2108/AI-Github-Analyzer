from urllib.parse import quote, urlparse

import requests

from .config import GITHUB_TOKEN

GITHUB_API_BASE = "https://api.github.com"
MAX_CONTENTS_WALK_ITEMS = 15000


class GitHubAPIError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def _github_headers(raw_readme: bool = False):
    headers = {
        "Accept": "application/vnd.github.v3.raw" if raw_readme else "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


def _request_github(path: str, *, raw_readme: bool = False, params=None):
    url = f"{GITHUB_API_BASE}{path}"
    res = requests.get(url, headers=_github_headers(raw_readme=raw_readme), params=params, timeout=30)

    if res.status_code < 400:
        return res

    payload_text = ""
    try:
        payload_text = res.json().get("message", "")
    except Exception:
        payload_text = res.text or ""

    if res.status_code == 404:
        raise GitHubAPIError("Repository not found, or it is private.", status_code=404)
    if res.status_code == 403 and "rate limit" in payload_text.lower():
        raise GitHubAPIError("GitHub API rate limit exceeded. Add GITHUB_TOKEN in backend/.env.", status_code=429)
    if res.status_code == 401:
        raise GitHubAPIError("GitHub token is invalid or expired.", status_code=401)

    raise GitHubAPIError(
        f"GitHub API request failed ({res.status_code}): {payload_text or 'Unknown error'}",
        status_code=502,
    )


def parse_repo_url(repo_url):
    if not repo_url or not repo_url.strip():
        raise ValueError("repo_url is required")

    normalized_url = repo_url.strip()
    if "://" not in normalized_url:
        normalized_url = f"https://{normalized_url}"

    parsed = urlparse(normalized_url)
    path_parts = [part for part in parsed.path.split("/") if part]

    if len(path_parts) < 2:
        raise ValueError("Invalid GitHub repository URL")

    owner, repo = path_parts[0], path_parts[1]
    if repo.endswith(".git"):
        repo = repo[:-4]

    return owner, repo


def get_repo_metadata(owner, repo):
    res = _request_github(f"/repos/{owner}/{repo}")
    data = res.json()
    return {
        "owner": owner,
        "repo": repo,
        "full_name": data.get("full_name", f"{owner}/{repo}"),
        "default_branch": data.get("default_branch", "main"),
        "description": data.get("description") or "",
        "stargazers_count": data.get("stargazers_count", 0),
        "forks_count": data.get("forks_count", 0),
        "open_issues_count": data.get("open_issues_count", 0),
        "language": data.get("language") or "",
    }


def _normalize_entry(path: str, item_type: str, size=None):
    mapped_type = item_type
    if item_type in ("tree", "dir"):
        mapped_type = "dir"
    elif item_type in ("blob", "file"):
        mapped_type = "file"
    elif item_type in ("commit", "submodule"):
        mapped_type = "submodule"

    normalized = {
        "path": path,
        "name": path,
        "type": mapped_type,
    }
    if mapped_type == "file" and isinstance(size, int) and size >= 0:
        normalized["size"] = size
    return normalized


def _get_repo_files_from_tree(owner, repo, default_branch):
    res = _request_github(
        f"/repos/{owner}/{repo}/git/trees/{default_branch}",
        params={"recursive": "1"},
    )
    payload = res.json()
    tree = payload.get("tree", [])

    items = []
    for node in tree:
        path = node.get("path")
        node_type = node.get("type")
        if not path or not node_type:
            continue
        items.append(_normalize_entry(path, node_type, size=node.get("size")))

    return items, bool(payload.get("truncated", False))


def _walk_repo_contents(owner, repo):
    queue = [""]
    items = []

    while queue:
        current = queue.pop(0)
        suffix = f"/{quote(current, safe='/')}" if current else ""
        res = _request_github(f"/repos/{owner}/{repo}/contents{suffix}")
        payload = res.json()

        entries = payload if isinstance(payload, list) else [payload]
        for entry in entries:
            path = entry.get("path") or entry.get("name")
            entry_type = entry.get("type")
            if not path or not entry_type:
                continue

            items.append(_normalize_entry(path, entry_type, size=entry.get("size")))

            if entry_type == "dir":
                queue.append(path)

            if len(items) >= MAX_CONTENTS_WALK_ITEMS:
                return items

    return items


def get_repo_files(owner, repo, metadata=None):
    repo_metadata = metadata or get_repo_metadata(owner, repo)
    files, truncated = _get_repo_files_from_tree(owner, repo, repo_metadata["default_branch"])

    if truncated or not files:
        files = _walk_repo_contents(owner, repo)

    unique = {}
    for item in files:
        unique[item["path"]] = item

    return list(unique.values())


def get_readme(owner, repo):
    try:
        res = _request_github(f"/repos/{owner}/{repo}/readme", raw_readme=True)
        return res.text
    except GitHubAPIError as exc:
        if exc.status_code == 404:
            return ""
        raise

