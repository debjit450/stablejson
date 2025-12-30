import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  FileSearch,
  FileCode,
  Binary,
  Search,
  BarChart3,
  Shuffle,
  Shield,
  Eraser,
  GitCompare,
  ArrowRight,
  Sparkles,
  Github,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const features = [
    { icon: CheckCircle2, text: "Validate and format", description: "Instantly validate JSON syntax and format with proper indentation" },
    { icon: Eraser, text: "Clean null and empty values", description: "Remove null, undefined, and empty values to clean up your data" },
    { icon: GitCompare, text: "Compare and diff", description: "Side-by-side comparison with highlighted differences" },
    { icon: FileSearch, text: "Inspect and extract paths", description: "Navigate JSON structure and extract specific data paths" },
    { icon: FileCode, text: "Generate types", description: "Auto-generate TypeScript interfaces and Zod schemas" },
    { icon: Binary, text: "Canonical output", description: "Deterministic JSON output for consistent hashing and comparison" },
    { icon: Search, text: "JSONPath queries", description: "Query JSON data using JSONPath expressions" },
    { icon: BarChart3, text: "Analyze structure", description: "Get insights into JSON structure, size, and data types" },
    { icon: Shuffle, text: "Transform data", description: "Transform, flatten, and manipulate JSON structure" },
    { icon: Shield, text: "Custom validation", description: "Validate JSON against custom rules and schemas" },
  ];

  const principles = [
    {
      title: "Privacy First",
      description: "All processing happens locally in your browser. No data ever leaves your device.",
      icon: Shield,
    },
    {
      title: "No Dependencies",
      description: "Works completely offline after first load. No external services required.",
      icon: Binary,
    },
    {
      title: "Deterministic",
      description: "Same input always produces the same output. Perfect for automation and CI/CD.",
      icon: CheckCircle2,
    },
    {
      title: "Developer Focused",
      description: "Built by developers, for developers. Clean interface, powerful features.",
      icon: FileCode,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 max-w-6xl relative">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Clean, compare, and understand JSON
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display text-gradient mb-8 tracking-tight leading-tight">
              Work with JSON,
              <br />
              <span className="text-muted-foreground">without the noise.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-body">
              A fast, private, frontend-only utility for cleaning, formatting, diffing, and inspecting JSON. 
              Everything runs locally in your browser with no backend, no tracking, and no accounts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-semibold">
                <Link to="/app">
                  Start Processing JSON
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 h-auto font-semibold">
                <a href="https://github.com/debjit450/stablejson" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                No accounts required
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                No tracking or analytics
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                No backend dependencies
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                Works completely offline
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-6">
              Everything you need for JSON processing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From basic formatting to advanced analysis, StableJSON provides all the tools 
              you need to work with JSON data efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, text, description }, index) => (
              <div 
                key={text} 
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{text}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-6">
              Built on strong principles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              StableJSON is designed with privacy, reliability, and developer experience at its core.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map(({ title, description, icon: Icon }, index) => (
              <div 
                key={title}
                className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="animate-slide-up">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display text-foreground mb-6">
              Ready to clean up your JSON?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers who trust StableJSON for their JSON processing needs. 
              Start using it today — no signup required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-semibold">
                <Link to="/app">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="lg" asChild className="text-lg px-8 py-6 h-auto font-semibold">
                <Link to="/about">
                  Learn More
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-lg text-muted-foreground font-medium italic">
            "Simple tools last longer than complex ones."
          </blockquote>
        </div>
      </section>
    </Layout>
  );
}