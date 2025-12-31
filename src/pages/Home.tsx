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
  Zap,
  Lock,
  Layers,
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-alt { font-family: 'Space Mono', monospace; }
        .font-code { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="text-center flex flex-col items-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-2 rounded-full mb-6 sm:mb-10 bg-foreground/5 border border-border">
              <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="font-code text-xs tracking-wider text-muted-foreground uppercase">
                Next-Gen JSON Processing
              </span>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            </div>

            {/* Hero Title */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1]">
              <span className="block text-foreground">
                Work with
              </span>
              <span className="block mt-1 sm:mt-2 relative">
                <span className="font-code text-foreground relative inline-block">
                  &lt;JSON/&gt;
                </span>
              </span>
              <span className="block mt-1 sm:mt-2 text-muted-foreground">
                like never before
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-4">
              A <span className="text-foreground font-medium">hyper-fast</span>, <span className="text-foreground/80 font-medium">zero-trust</span> JSON utility.
              Everything runs <span className="text-foreground/90 font-medium">locally</span> in your browser—no servers, no tracking, no compromises.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-20 w-full sm:w-auto px-4">
              <Button
                asChild
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-display font-bold text-sm sm:text-base tracking-tight bg-foreground text-background hover:bg-foreground/90 border border-foreground/20"
              >
                <Link to="/app">
                  <span className="flex items-center">
                    Launch Processor
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-display font-semibold text-sm sm:text-base tracking-tight border-2 border-foreground/20 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/30 text-muted-foreground hover:text-foreground"
              >
                <a href="https://github.com/debjit450/stablejson" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Source
                </a>
              </Button>
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-code text-xs text-muted-foreground border-t border-border pt-6 sm:pt-10 px-4 w-full max-w-4xl">
              <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-foreground/5 border border-border">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">100% Local</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-foreground/5 border border-border">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-foreground/5 border border-border">
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">Zero Dependencies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 lg:py-28 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-foreground">
              Full-Spectrum <span className="text-muted-foreground">JSON</span> Toolkit
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light px-4">
              From validation to transformation, every tool you need in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, text, description }, index) => {
              const cardClasses = [
                "relative p-4 sm:p-6 rounded-2xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors duration-300 cursor-pointer",
                index % 3 === 0 ? "card-brand" : "",
                index % 3 === 1 ? "card-info" : "",
                index % 3 === 2 ? "card-accent-secondary" : "",
              ].filter(Boolean).join(" ");

              return (
                <div
                  key={text}
                  className={cardClasses}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="shrink-0 p-2 sm:p-3 rounded-xl bg-foreground/10 border border-border">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </div>

                    <div className="pt-1 flex-1">
                      <h3 className="font-display font-semibold text-sm sm:text-base text-foreground mb-2 tracking-tight">
                        {text}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
      </section>
      {/* Philosophy Section */}
      <section className="py-16 sm:py-20 lg:py-28 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="block text-foreground">Built on</span>
                <span className="block text-muted-foreground">
                  Engineering Truth
                </span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
                No analytics. No telemetry. No cloud processing. Just pure, deterministic JSON operations running at browser speed.
              </p>

              {/* Code Block */}
              <div className="hidden lg:block relative">
                <div className="relative p-4 sm:p-6 bg-background/90 border border-border rounded-2xl font-code text-xs sm:text-sm overflow-hidden">
                  <code className="block relative z-10">
                    <span className="text-muted-foreground">const</span> <span className="text-foreground/80">config</span> <span className="text-muted-foreground">=</span> <span className="text-muted-foreground">{"{"}</span>{"\n"}
                    <span className="text-muted-foreground/70">  // Privacy-first architecture</span>{"\n"}
                    {"  "}<span className="text-muted-foreground">"privacy"</span><span className="text-muted-foreground">:</span> <span className="text-foreground">true</span><span className="text-muted-foreground">,</span>{"\n"}
                    {"  "}<span className="text-muted-foreground">"offline"</span><span className="text-muted-foreground">:</span> <span className="text-foreground">true</span><span className="text-muted-foreground">,</span>{"\n"}
                    {"  "}<span className="text-muted-foreground">"tracking"</span><span className="text-muted-foreground">:</span> <span className="text-muted-foreground/70">null</span><span className="text-muted-foreground">,</span>{"\n"}
                    {"  "}<span className="text-muted-foreground">"speed"</span><span className="text-muted-foreground">:</span> <span className="text-foreground/80">"blazing"</span>{"\n"}
                    <span className="text-muted-foreground">{"}"}</span><span className="text-muted-foreground">;</span>
                  </code>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {principles.map(({ title, description, icon: Icon }, index) => (
                <div
                  key={title}
                  className="p-5 sm:p-7 rounded-2xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-colors duration-300 cursor-pointer"
                >
                  <div className="mb-4 sm:mb-5 p-2 sm:p-3 rounded-xl bg-foreground/10 border border-border inline-block">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="space-y-6 sm:space-y-10">
            {/* Central Icon */}
            <div className="relative inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-foreground/10 border-2 border-border flex items-center justify-center">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="block text-foreground">
                Ready to process JSON
              </span>
              <span className="block mt-1 sm:mt-2 text-muted-foreground">
                at the speed of thought?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-4">
              Join developers who demand privacy, speed, and precision. No signup, no tracking, no BS.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-4 px-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 rounded-xl font-display font-bold text-sm sm:text-base tracking-tight bg-foreground text-background hover:bg-foreground/90 border border-foreground/20"
              >
                <Link to="/app">
                  <span className="flex items-center">
                    Start Processing
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 rounded-xl font-display font-semibold text-sm sm:text-base tracking-tight text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              >
                <Link to="/about">
                  Learn More
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 sm:py-16 border-t border-border bg-background/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <blockquote className="font-code text-sm sm:text-base lg:text-lg text-muted-foreground font-medium italic mb-4 sm:mb-6">
            "The best tool is the one you can trust."
          </blockquote>

          <div className="flex justify-center">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>
    </Layout>
  );
}