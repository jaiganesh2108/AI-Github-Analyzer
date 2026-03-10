# AI GitHub Project Analyzer

An AI-powered developer tool that analyzes any GitHub repository and generates intelligent insights about the project architecture, code quality, and potential improvements.

Paste a repository link and instantly get an AI-generated breakdown of the project.

<img width="500" height="500" alt="Screenshot (427)" src="https://github.com/user-attachments/assets/8cc3e97a-bb47-4e45-8e4f-3eebc909f0bc" />
<img width="500" height="500" alt="Screenshot (428)" src="https://github.com/user-attachments/assets/c7cffa78-1bde-44c8-96a6-354db1217da7" />
<img width="500" height="500" alt="Screenshot (429)" src="https://github.com/user-attachments/assets/f65e87d8-a6ad-44ef-9249-8eecca68524e" />
<img width="500" height="500" alt="Screenshot (430)" src="https://github.com/user-attachments/assets/89569f31-0ee5-423d-8a59-18a2fdaa37ae" />
<img width="500" height="500" alt="Screenshot (431)" src="https://github.com/user-attachments/assets/bcd4f2df-06e4-456a-9358-599e3485976d" />

---

## Overview

AI GitHub Project Analyzer helps developers understand unfamiliar codebases quickly. It fetches repository data using the GitHub API and analyzes the structure and documentation using the Gemini AI model.

The tool provides:

* Project summary
* Architecture explanation
* Code improvement suggestions
* Bug detection hints
* Repository structure visualization

This project is built using Python for the backend and React for the frontend.

---

## Tech Stack

### Backend

* Python
* FastAPI
* GitHub REST API
* Gemini AI API

### Frontend

* React
* Vite
* Axios

### AI

* Google Gemini (gemini-1.5-flash)

---

## Features

### Repository Analysis

Enter a GitHub repository URL and the system automatically fetches project data.

### AI Project Summary

The AI generates a concise summary explaining what the project does.

### Architecture Explanation

Understand how the project is structured and how its components interact.

### Improvement Suggestions

AI recommends improvements for maintainability, scalability, and performance.

### Bug Detection

The system identifies possible issues or risky coding patterns.

### Repository Structure Viewer

Displays a simplified view of repository files and folders.

---

## Project Architecture

```
ai-github-analyzer
│
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── github_service.py
│   │   ├── repo_parser.py
│   │   ├── gemini_analyzer.py
│   │   └── config.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── frontend
    ├── src
    │   ├── components
    │   │   ├── RepoInput.jsx
    │   │   └── AnalysisResult.jsx
    │   │
    │   ├── services
    │   │   └── api.js
    │   │
    │   ├── pages
    │   │   └── Home.jsx
    │   │
    │   ├── App.jsx
    │   └── main.jsx
```

---

## Installation

### Clone the Repository

```
git clone https://github.com/your-username/ai-github-analyzer.git
cd ai-github-analyzer
```

---

## Backend Setup

Navigate to the backend directory.

```
cd backend
```

Create a virtual environment.

```
python -m venv venv
```

Activate it.

```
venv\Scripts\activate
```

Install dependencies.

```
pip install -r requirements.txt
```

Create a `.env` file and add your Gemini API key.

```
GEMINI_API_KEY=your_api_key_here
```

Start the backend server.

```
uvicorn app.main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

---

## Frontend Setup

Open a new terminal.

```
cd frontend
```

Install dependencies.

```
npm install
```

Start the development server.

```
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Usage

1. Open the web application.
2. Paste a GitHub repository URL.
3. Click **Analyze**.
4. The AI will generate insights about the repository.

Example:

```
https://github.com/facebook/react
```

---

## Example Output

The AI analyzer will return:

**Project Summary**

> A frontend JavaScript library for building user interfaces using a component-based architecture.

**Architecture Explanation**

> The project is organized into modular components with a virtual DOM rendering system.

**Improvement Suggestions**

* Add additional documentation for internal APIs
* Improve testing coverage

**Potential Issues**

* Some modules contain large files that could be split into smaller components.

---

## Future Improvements

* Full repository file scanning
* Architecture graph visualization
* Code quality score
* Security vulnerability detection
* Pull request suggestions
* CI/CD integration

---

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

---

## License

This project is licensed under the MIT License.

---

## Author

Built as an AI developer tool for analyzing GitHub repositories using modern AI models and developer-friendly technologies.
