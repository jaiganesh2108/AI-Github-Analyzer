import { useState } from "react";
import { analyzeRepo } from "../services/api";

export default function RepoInput({ setResults }) {
  const [Url, setUrl] = useState("")

  const handleAnalyze = async () => {
    const res = await analyzeRepo(Url)
    setResults(res.data)
  }

  return (
    <div>
        <input
            placeholder="Paste GitHub Repository URL"
            value={Url}
            onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAnalyze}>Analyze</button>
    </div>
  )
}