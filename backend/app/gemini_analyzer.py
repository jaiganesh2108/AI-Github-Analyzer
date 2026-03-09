import google.generativeai as genai
from .config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_project(readme, structure):
    prompt = f"""
    Analyze this Github project.
    
    README:
    {readme}
    FILE STRUCTURE:
    {structure}

    Provide:
    
    1. Project summary
    2. Architecture explanation
    3. Improvement suggestions
    4. Possible bugs
    """

    response = model.generate_content(prompt)
    
    return response.text