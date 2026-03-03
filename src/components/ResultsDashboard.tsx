import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Info } from "lucide-react";

export interface AnalysisResult {
  verdict: "real" | "fake";
  confidenceScore: number;
  highlightedText: string;
  suspiciousWords: string[];
  modelAccuracy: number;
  confusionMatrix: { tp: number; fp: number; fn: number; tn: number };
}

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const ResultsDashboard = ({ result }: ResultsDashboardProps) => {
  const isReal = result.verdict === "real";

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-6 py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - Main Result */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verdict Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`glass-card p-8 ${isReal ? "glow-success" : "glow-destructive"}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isReal ? "bg-success/15" : "bg-destructive/15"}`}>
                {isReal ? (
                  <ShieldCheck className="h-7 w-7 text-success" />
                ) : (
                  <ShieldAlert className="h-7 w-7 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verdict</p>
                <h2 className={`text-3xl font-extrabold ${isReal ? "text-success" : "text-destructive"}`}>
                  {isReal ? "Likely Authentic" : "Likely Fake"}
                </h2>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Confidence Score</span>
                <span className={`text-2xl font-bold ${isReal ? "text-success" : "text-destructive"}`}>
                  {result.confidenceScore}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidenceScore}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full ${isReal ? "bg-success" : "bg-destructive"}`}
                />
              </div>
            </div>
          </motion.div>

          {/* Highlighted Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Article Analysis
            </h3>
            <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-sm leading-7 text-secondary-foreground/80">
                <HighlightedText text={result.highlightedText} words={result.suspiciousWords} />
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE - Analytics */}
        <div className="space-y-6">
          {/* Model Accuracy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Model Accuracy</h3>
              <div className="group relative">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <div className="absolute right-0 top-6 w-52 p-3 rounded-lg bg-card border border-border text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Accuracy measured on a held-out test set of 10,000+ labeled articles.
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold text-foreground">{result.modelAccuracy}%</p>
              <p className="text-xs text-muted-foreground mt-1">Test Set Accuracy</p>
            </div>
          </motion.div>

          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Confusion Matrix</h3>
            <div className="grid grid-cols-2 gap-2">
              <MatrixCell label="True Pos" value={result.confusionMatrix.tp} variant="success" />
              <MatrixCell label="False Pos" value={result.confusionMatrix.fp} variant="destructive" />
              <MatrixCell label="False Neg" value={result.confusionMatrix.fn} variant="destructive" />
              <MatrixCell label="True Neg" value={result.confusionMatrix.tn} variant="success" />
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>Predicted Positive</span>
              <span>Predicted Negative</span>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

const MatrixCell = ({ label, value, variant }: { label: string; value: number; variant: "success" | "destructive" }) => (
  <div className={`rounded-xl p-4 text-center ${variant === "success" ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
    <p className={`text-xl font-bold ${variant === "success" ? "text-success" : "text-destructive"}`}>{value}</p>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const HighlightedText = ({ text, words }: { text: string; words: string[] }) => {
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-destructive/20 text-destructive rounded px-1 py-0.5 font-medium">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default ResultsDashboard;
