import { motion } from "framer-motion";
import { Link2, Cpu, BarChart3, FileText, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste the URL",
    description: "Copy the link of any news article you want to verify and paste it into the analyzer on the home page.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Content Extraction",
    description: "Our system fetches the article and extracts the main text content, filtering out ads, navigation, and irrelevant elements.",
  },
  {
    icon: Brain,
    step: "03",
    title: "TF-IDF Vectorization",
    description: "The text is transformed into numerical features using Term Frequency-Inverse Document Frequency with 3,000 optimized features.",
  },
  {
    icon: Cpu,
    step: "04",
    title: "SVM Classification",
    description: "A trained Linear Support Vector Machine model classifies the article as authentic or fake based on learned patterns from 10,000+ articles.",
  },
  {
    icon: BarChart3,
    step: "05",
    title: "Confidence Scoring",
    description: "The model calculates a confidence score indicating how certain it is about the verdict, along with identifying suspicious phrases.",
  },
  {
    icon: CheckCircle,
    step: "06",
    title: "Results Dashboard",
    description: "You receive a detailed breakdown: verdict, confidence score, highlighted suspicious words, model accuracy, and confusion matrix metrics.",
  },
];

const techStack = [
  { label: "Model", value: "Linear SVM (Support Vector Machine)" },
  { label: "Vectorizer", value: "TF-IDF (3,000 features)" },
  { label: "Training Data", value: "10,000+ labeled news articles" },
  { label: "Test Accuracy", value: "96.8%" },
  { label: "Response Time", value: "< 3 seconds" },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Process</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            How It<br />
            <span className="gradient-text">Works</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From URL to verdict in seconds. Here's the complete pipeline behind TruthTracer AI's analysis engine.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border/60 hidden md:block" />

            <div className="space-y-8">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="glass-card-hover p-6 flex-1">
                    <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">Step {item.step}</span>
                    <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Technical Specifications</h2>
            <div className="space-y-4">
              {techStack.map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
