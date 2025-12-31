import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { ViewCounter } from "@/components/ViewCounter";
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
  Cpu,
  Zap,
  Lock,
  Layers,
  Code2,
  Terminal,
  LucideLayers,
  CurlyBraces,
} from "lucide-react";

export default function Home() {
  const features = [
    { icon: CheckCircle2, text: "Validate & Format", description: "Instantly fix JSON syntax with perfect indentation." },
    { icon: Eraser, text: "Sanitize Data", description: "Prune nulls, undefined, and empty values automatically." },
    { icon: GitCompare, text: "Smart Diff", description: "Visual side-by-side comparison with high-contrast diffing." },
    { icon: FileSearch, text: "Path Explorer", description: "Navigate structure and extract precise JSONPaths." },
    { icon: FileCode, text: "Type Generator", description: "One-click TypeScript interfaces and Zod schemas." },
    { icon: Binary, text: "Deterministic", description: "Canonical output for consistent hashing and storage." },
    { icon: Search, text: "Query Engine", description: "Filter deeply nested data using JSONPath expressions." },
    { icon: BarChart3, text: "Deep Analysis", description: "Visualize structure depth, node counts, and data size." },
    { icon: Shuffle, text: "Transform", description: "Flatten, unflatten, or remap structures on the fly." },
  ];

  const principles = [
    {
      title: "Local-First Architecture",
      description: "Zero latency. Zero data leakage. All processing happens in your browser's memory.",
      icon: Shield,
    },
    {
      title: "Deterministic Output",
      description: "Stable key sorting ensures that the same input always yields the exact same output hash.",
      icon: Binary,
    },
    {
      title: "Developer Experience",
      description: "Built for copy-pasting. Clean output ready for your codebase, config files, or PRs.",
      icon: Terminal,
    },
  ];

  return (
    <Layout>
      {/* Dynamic Font Loading */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          --font-display: 'Plus Jakarta Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .font-display { font-family: var(--font-display); }
        .font-code { font-family: var(--font-mono); }
        
        .hero-glow {
          background: radial-gradient(circle at center, hsl(var(--primary) / 0.15) 0%, transparent 70%);
        }
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 dot-pattern pointer-events-none -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-3xl -z-10" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="flex flex-col items-center text-center animate-fade-in">

            {/* Badge */}
            <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-background/80 to-background/60 border border-border/50 backdrop-blur-sm shadow-lg transition-all hover:border-primary/30 mb-8 cursor-default hover-lift">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors uppercase">
                v1.5.0 Available Now
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground leading-[1.05] animate-slide-up">
              Engineered for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground">
                JSON Perfection
              </span>
            </h1>

            <p className="font-body text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
              The privacy-first JSON processor that developers trust. Validate, format, and generate types directly in your browser.
              <span className="hidden sm:inline block mt-2 text-base text-muted-foreground/70"> No servers. No tracking. Just pure performance.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-scale-in">
              <Button
                asChild
                className="w-full sm:w-auto h-14 px-8 rounded-2xl font-display font-bold text-base bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/20 transition-all hover:scale-105 hover-lift"
              >
                <Link to="/app">
                  Launch Processor
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto h-14 px-8 rounded-2xl font-display font-semibold text-base border-border/50 bg-background/50 backdrop-blur-sm hover:bg-foreground/5 transition-all hover-lift"
              >
                <a href="https://github.com/debjit450/stablejson" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  Star on GitHub
                </a>
              </Button>
            </div>

            {/* Stats/Tech Stack */}
            <div className="mt-20 pt-8 border-t border-border/30 w-full max-w-4xl flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold">100% Local Processing</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <LucideLayers className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-semibold">Zero Dependencies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-16 md:mb-24 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Everything you need. <br />
              <span className="text-muted-foreground">Nothing you don't.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers who demand precision, speed, and reliability in their JSON workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, text, description }, i) => (
              <div
                key={text}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-card/60 to-card/30 border border-border/40 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden backdrop-blur-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{text}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-medium group-hover:text-foreground/80 transition-colors">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Technical Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text Content */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3 h-3" />
                Philosophy
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Built on Engineering <br />
                <span className="text-muted-foreground">Truths.</span>
              </h2>

              <div className="space-y-6">
                {principles.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border/50">
                        <item.icon className="w-5 h-5 text-foreground/70" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Code Block */}
            <div className="relative lg:pl-10">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50" />
              <div className="relative rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  <div className="ml-auto font-code text-[10px] text-white/30">config.json</div>
                </div>
                {/* Code */}
                <div className="p-6 font-code text-sm sm:text-base overflow-x-auto">
                  <pre className="leading-relaxed">
                    <code>
                      <span className="text-purple-400">const</span> <span className="text-blue-400">manifest</span> <span className="text-white/60">=</span> <span className="text-yellow-400">{"{"}</span>{"\n"}
                      {"  "}<span className="text-green-400">"privacy"</span><span className="text-white/60">:</span> <span className="text-orange-400">true</span><span className="text-white/60">,</span>{"\n"}
                      {"  "}<span className="text-green-400">"telemetry"</span><span className="text-white/60">:</span> <span className="text-red-400">null</span><span className="text-white/60">,</span>{"\n"}
                      {"  "}<span className="text-green-400">"features"</span><span className="text-white/60">:</span> <span className="text-yellow-400">{"["}</span>{"\n"}
                      {"    "}<span className="text-cyan-400">"Validate"</span><span className="text-white/60">,</span>{"\n"}
                      {"    "}<span className="text-cyan-400">"Format"</span><span className="text-white/60">,</span>{"\n"}
                      {"    "}<span className="text-cyan-400">"Type Gen"</span>{"\n"}
                      {"  "}<span className="text-yellow-400">{"]"}</span>{"\n"}
                      <span className="text-yellow-400">{"}"}</span><span className="text-white/60">;</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Large CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground text-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-2xl bg-background/10 backdrop-blur-sm border border-background/20">
              <Sparkles className="w-8 h-8 text-background" />
            </div>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-bold mb-6 text-background tracking-tight">
            Ready to clean up your data?
          </h2>
          <p className="text-background/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Join thousands of developers using the fastest, most secure JSON tool on the web.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-full font-display font-bold text-foreground bg-background hover:bg-background/90 border-0"
            >
              <Link to="/app">
                Launch Processor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto h-14 px-10 rounded-full font-display font-bold text-dark border-background/30 hover:bg-background/10 hover:text-white hover:border-background/50"
            >
              <Link to="/about">
                How it works
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <CurlyBraces className="w-5 h-5" />
            <span className="font-display font-bold">StableJSON</span>
          </div>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Built for the community. Open source and free forever.
          </p>
        </div>
      </footer>
    </Layout>
  );
}