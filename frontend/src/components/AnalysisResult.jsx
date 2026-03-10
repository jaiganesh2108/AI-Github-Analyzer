export default function AnalysisResult({ result }) {
    if(!result) return null

    return (
        <div>
            <h2>Analysis Result</h2>
            <pre>{result.analysis}</pre>
            <h3>Repo Structure</h3>

            <ul>
                {result.structure.map((f,i)=>(
                    <li key={i}>
                        {f.name} ({f.type})
                    </li>
                ))}
            </ul>
        </div>
    )
}