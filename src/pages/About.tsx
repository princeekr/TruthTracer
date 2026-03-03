import { motion } from "framer-motion";
import { ShieldCheck, Zap, Eye, Lock, Target, Globe } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "AI-Powered Detection",
    description: "Our machine learning model analyzes linguistic patterns, source credibility, and content structure to identify misinformation with high precision.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get real-time verdicts in under 3 seconds. No waiting, no manual review—just fast, accurate analysis powered by optimized ML pipelines.",
  },
  {
    icon: Eye,
    title: "Transparent Analysis",
    description: "See exactly which words and phrases triggered suspicion, with a full confidence breakdown and detailed model performance metrics.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "We never store your articles or URLs. All analysis is performed in real-time and discarded immediately after results are delivered.",
  },
  {
    icon: Target,
    title: "96.8% Accuracy",
    description: "Trained and validated on over 10,000 labeled news articles, our model achieves industry-leading accuracy in fake news detection.",
  },
  {
    icon: Globe,
    title: "Open & Accessible",
    description: "Free to use for everyone. Our mission is to make news verification accessible to journalists, researchers, and everyday readers.",
  },
];

const About = () => {
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
            <span className="text-xs font-medium text-primary tracking-wide uppercase">About Us</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            Fighting Misinformation<br />
            <span className="gradient-text">With Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TruthTracer AI is built to combat the growing threat of fake news. We leverage cutting-edge machine learning to give you instant, transparent verdicts on any news article.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card-hover p-7 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              In an era where misinformation spreads faster than truth, we believe everyone deserves access to reliable news verification tools. TruthTracer AI empowers individuals, journalists, and organizations to make informed decisions by providing instant, AI-powered authenticity analysis—completely free and privacy-respecting.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
