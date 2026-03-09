import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/api",
})

export const analyzeRepo = (url) => {
    return api.get("/analyze", {
        params: { repo_url: url}
    })
}