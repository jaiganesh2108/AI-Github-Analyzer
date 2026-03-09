from fastapi import FastAPI
from .github_service import parse_repo_url, get_repo_files, get_readme
from .repo_parser import extract_structure
from .gemini_analyzer import analyze_project

app = FastAPI()
print("API is running....")

@app.get("/analyze")
def analyze(repo_url: str):
    owner, repo = parse_repo_url(repo_url)
    files = get_repo_files(owner, repo)
    readme = get_readme(owner, repo)
    structure = extract_structure(files)
    analysis = analyze_project(readme, structure)
    return {
        "structure": structure,
        "analysis": analysis
    }