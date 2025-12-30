import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, CheckCircle2, FileCode } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display text-foreground mb-6">
            About StableJSON
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            StableJSON exists to do one thing well: format and validate JSON in a
            predictable, reliable way—without bloat or hidden behavior.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Local-First Processing
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    JSON is processed entirely in your browser. Nothing is sent
                    to any server.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Deterministic Output
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The same input always produces the same formatted output,
                    with stable and predictable key ordering.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Fast & Lightweight
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Small bundle size, minimal dependencies, and instant
                    feedback—even for large JSON files.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Copy-Friendly Formatting
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Clean, stable output that’s easy to copy, diff, and reuse in
                    configs, reviews, and documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Core Principles
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Client-side only:</strong>{" "}
                  All formatting and validation happens locally in your browser
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">No tracking:</strong> No
                  analytics, telemetry, cookies, or behavioral logging
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Offline-capable:</strong>{" "}
                  Works without an internet connection after the first load
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    Predictable by design:
                  </strong>{" "}
                  Output is stable and consistent across sessions and machines
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Why StableJSON?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            StableJSON prioritizes{" "}
            <strong className="text-foreground">predictability</strong>,{" "}
            <strong className="text-foreground">clarity</strong>, and{" "}
            <strong className="text-foreground">trust</strong>. It’s meant to be a
            tool you can rely on without thinking about it.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Instead of adding more features, StableJSON focuses on doing one job
            well—processing JSON quickly, locally, and consistently.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Ready to use it?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/app">
                Open the App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/open-source">View the Source</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <blockquote className="text-lg text-muted-foreground font-medium italic">
            “Simple tools last longer than complex ones.”
          </blockquote>
        </div>
      </div>
    </Layout>
  );
}
