import os
from dotenv import load_dotenv

load_dotenv()


def _env(name: str):
	value = os.getenv(name)
	return value.strip() if value else None


GEMINI_API_KEY = _env("GEMINI_API_KEY")
GITHUB_TOKEN = _env("GITHUB_TOKEN")
GEMINI_MODEL = _env("GEMINI_MODEL")