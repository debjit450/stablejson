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
  Code2,
  Terminal,
  Cpu,
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
      title: "Local-First",
      description: "All formatting and validation run entirely in your browser. Nothing is sent anywhere.",
      icon: Shield,
    },
    {
      title: "Deterministic Output",
      description: "The same JSON input always produces the same output, with stable key ordering.",
      icon: CheckCircle2,
    },
    {
      title: "Fast & Lightweight",
      description: "Minimal bundle, minimal dependencies, and instant feedback—even for large files.",
      icon: Binary,
    },
    {
      title: "Copy-Friendly",
      description: "Clean, stable formatting designed for copying into codebases, configs, and reviews.",
      icon: FileCode,
    },
  ];


  return (
    <Layout>
      {/* Complex Layered Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
        {/* Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

        {/* Moving Light Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow opacity-30"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow opacity-30" style={{ animationDelay: '2s' }}></div>

        {/* Abstract Tech Lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(0,0) scale(2,2)">
            <circle cx="20" cy="20" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-circles)" />
          <path d="M0 100 L 100 0 M -100 200 L 200 -100 M -200 300 L 300 -200" stroke="currentColor" strokeWidth="0.5" fill="none" className="animate-[dash_20s_linear_infinite]" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="container mx-auto px-4 max-w-5xl relative">
          <div className="text-center animate-slide-up flex flex-col items-center">

            {/* Sleek Pill Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8 backdrop-blur-md shadow-sm">
              <span className="tracking-wide">Clean, compare, and understand JSON</span>
            </div>

            {/* Headline - Sleeker sizes */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.15] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Work with <span className="text-primary font-mono">&lt;JSON&gt;</span>,
              <br />
              <span className="">without the noise.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              A fast, private, frontend-only utility for cleaning, formatting, diffing, and inspecting JSON.
              Everything runs locally in your browser.
            </p>

            {/* CTA Buttons - Refined Sizes (h-11 instead of h-14) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto h-11 px-8 rounded-lg shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_-5px_rgba(var(--primary),0.6)] transition-all duration-300 bg-primary text-primary-foreground hover:scale-[1.02] font-semibold tracking-tight">
                <Link to="/app">
                  Start Processing JSON
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full sm:w-auto h-11 px-8 rounded-lg border-primary/20 bg-background/20 backdrop-blur-md hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 font-medium">
                <a href="https://github.com/debjit450/stablejson" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>

            {/* Trust Badges - Sleeker */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-mono text-muted-foreground/70 border-t border-border/30 pt-8 px-4 w-full max-w-3xl">
              <span className="flex items-center gap-2 relative before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                Local-First Processing
              </span>
              <span className="flex items-center gap-2 relative before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                Fast & Lightweight
              </span>
              <span className="flex items-center gap-2 relative before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                Copy-Friendly Output
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Everything you need for <span className="text-primary">JSON processing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From basic formatting to advanced analysis, StableJSON provides all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, text, description }, index) => (
              <div
                key={text}
                className="group relative p-5 rounded-xl bg-card/20 border border-white/5 hover:border-primary/30 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex items-start gap-4">
                  {/* Icon container - removed heavy box, now a subtle glowing well */}
                  <div className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)] group-hover:scale-105 transition-transform duration-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-semibold text-foreground mb-1.5 tracking-tight group-hover:text-primary transition-colors duration-300">{text}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative">
        {/* Separator Line with glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
                Built on strong <br />
                <span className="text-primary">engineering principles</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 font-light">
                StableJSON is designed with privacy, reliability, and developer experience at its core. We removed the fluff to focus on the raw data.
              </p>
              {/* Sleeker Code Block */}
              <div className="hidden lg:flex p-5 bg-[#0d1117]/80 border border-white/10 rounded-xl font-mono text-[13px] text-muted-foreground/80 backdrop-blur-md shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <Code2 className="w-6 h-6" />
                </div>
                <code className="whitespace-pre relative z-10">
                  <span className="text-blue-400">const</span> <span className="text-yellow-400">config</span> = {"{"}{"\n"}
                  {"  "}<span className="text-green-400">"privacy"</span>: <span className="text-orange-400">true</span>,{"\n"}
                  {"  "}<span className="text-green-400">"offline"</span>: <span className="text-orange-400">true</span>,{"\n"}
                  {"  "}<span className="text-green-400">"tracking"</span>: <span className="text-red-400">null</span>{"\n"}
                  {"}"};
                </code>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {principles.map(({ title, description, icon: Icon }, index) => (
                <div
                  key={title}
                  className="p-6 rounded-xl bg-card/20 border border-white/5 backdrop-blur-md hover:bg-card/30 hover:border-primary/20 transition-all duration-300 group"
                >
                  <Icon className="w-7 h-7 text-primary/80 group-hover:text-primary mb-4 transition-colors" />
                  <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="animate-slide-up">
            {/* Central Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] rotate-3 transform hover:rotate-6 transition-transform duration-500 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Ready to clean up your JSON?
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-light">
              Join thousands of developers who trust StableJSON. Start using it today — no signup required.
            </p>

            {/* Sleek Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-11 px-10 rounded-lg shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] bg-primary text-primary-foreground hover:scale-[1.02] transition-all font-semibold tracking-tight">
                <Link to="/app">
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto h-11 px-10 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-background/40">
                <Link to="/about">
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-12 border-t border-border/20 bg-background/50 backdrop-blur-md relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <blockquote className="text-base sm:text-lg text-muted-foreground/80 font-medium italic font-serif">
            "Simple tools last longer than complex ones."
          </blockquote>
          <div className="mt-4 flex justify-center text-primary/30">
            <Terminal className="w-4 h-4" />
          </div>
        </div>
      </section>
    </Layout>
  );
}