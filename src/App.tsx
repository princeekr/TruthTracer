import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="border-t border-border/40 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 TruthTracer AI. Built to fight misinformation.
          </p>
        </footer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
