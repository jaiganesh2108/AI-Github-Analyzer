from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .github_service import GitHubAPIError, parse_repo_url, get_repo_files, get_readme, get_repo_metadata
from .repo_parser import extract_structure, build_repo_stats
from .gemini_analyzer import analyze_project

app = FastAPI()
print("API is running....")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/analyze")
@app.get("/analyze")
def analyze(repo_url: str):
    try:
        owner, repo = parse_repo_url(repo_url)
        metadata = get_repo_metadata(owner, repo)
        files = get_repo_files(owner, repo, metadata=metadata)
        readme = get_readme(owner, repo)
        structure = extract_structure(files)
        stats = build_repo_stats(structure)
        analysis = analyze_project(readme, structure, stats)
        return {
            "repository": metadata,
            "stats": stats,
            "structure": structure,
            "analysis": analysis,
        }
    except GitHubAPIError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Analysis failed: {exc}") from exc