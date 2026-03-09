import requests 

GITHUB_API = ""

def parse_repo_url(repo_url):
    parts = repo_url.rstrip("/").split("/")
    owner = parts[-2]
    repo = parts[-1]
    return owner, repo


def get_repo_files(owner, repo):
    url = f"{GITHUB_API}/{owner}/{repo}/contents"
    res = requests.get(url)
    return res.json()


def get_readme(owner, repo):
    url = f"{GITHUB_API}/{owner}/{repo}/readme"
    headers = {"Accept": "application/vnd.github.v3.raw"}
    res = requests.get(url, headers=headers)
    return res.text 