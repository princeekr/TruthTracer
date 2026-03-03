import { useState, useRef } from "react";
import axios from "axios";
import HeroSection from "@/components/HeroSection";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ResultsDashboard, { type AnalysisResult } from "@/components/ResultsDashboard";

type AppState = "idle" | "loading" | "results" | "error";

const API_BASE = "http://localhost:8000";

interface BackendResponse {
  verdict: "REAL" | "FAKE";
  confidence: number;
  highlightedText: string;
  suspiciousWords: string[];
  accuracy: number;
  confusionMatrix: { tp: number; fp: number; fn: number; tn: number };
}

/** Call FastAPI backend and map the response to the ResultsDashboard shape. */
const analyzeArticle = async (url: string): Promise<AnalysisResult> => {
  const { data } = await axios.post<BackendResponse>(`${API_BASE}/analyze`, { url });

  return {
    verdict: data.verdict === "REAL" ? "real" : "fake",
    confidenceScore: Math.round(data.confidence * 100),
    highlightedText: data.highlightedText,
    suspiciousWords: data.suspiciousWords,
    modelAccuracy: parseFloat((data.accuracy * 100).toFixed(2)),
    confusionMatrix: data.confusionMatrix,
  };
};

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (url: string) => {
    setState("loading");
    setResult(null);
    setError("");
    try {
      const data = await analyzeArticle(url);
      setResult(data);
      setState("results");
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    } catch (err: unknown) {
      // Surface the backend's detail message when available
      let message = "Unable to extract article content. Please try another URL.";
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (typeof detail === "string") message = detail;
        else if (!err.response) message = "Cannot reach the analysis server. Make sure the backend is running on http://localhost:8000";
      }
      setError(message);
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onAnalyze={handleAnalyze} isLoading={state === "loading"} />
      <div ref={resultsRef}>
        {state === "loading" && <LoadingState />}
        {state === "error" && <ErrorState message={error} />}
        {state === "results" && result && <ResultsDashboard result={result} />}
      </div>
    </div>
  );
};

export default Index;
