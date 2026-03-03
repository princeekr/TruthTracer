import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message }: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-12 flex justify-center"
  >
    <div className="glass-card border-warning/30 p-8 max-w-md text-center">
      <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-warning" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
      <p className="text-sm text-muted-foreground">
        {message || "Unable to extract article content. Please try another URL."}
      </p>
    </div>
  </motion.div>
);

export default ErrorState;
