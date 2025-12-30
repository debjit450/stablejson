import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Heart } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display text-foreground mb-6">About StableJSON</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built to solve a common problem: most JSON tools are either bloated, 
            intrusive, or unreliable for everyday work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Philosophy</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your data never leaves your browser. No tracking, no analytics, no accounts required.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Deterministic</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The same input always produces the same output. Perfect for automation and CI/CD.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Developer Focused</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Built by developers, for developers. Clean interface, powerful features, no bloat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Core Principles</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">No data collection:</strong> We don't collect, store, or transmit any of your JSON data
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Client-side only:</strong> All processing happens entirely in your browser
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Offline capable:</strong> Works completely offline after first load
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Open source:</strong> Transparent, auditable, and community-driven
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Why StableJSON?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            StableJSON focuses on <strong className="text-foreground">clarity</strong>, <strong className="text-foreground">determinism</strong>, and <strong className="text-foreground">trust</strong>. 
            It's designed to be the kind of tool you bookmark once and keep using for years.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe that simple tools last longer than complex ones. That's why StableJSON does one thing well: 
            process JSON data quickly, privately, and reliably.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Ready to try it?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/app">
                Start Processing JSON
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/open-source">
                Learn More About Our Philosophy
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <blockquote className="text-lg text-muted-foreground font-medium italic">
            "Simple tools last longer than complex ones."
          </blockquote>
        </div>
      </div>
    </Layout>
  );
}
