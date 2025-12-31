import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Zap, Shield, Code, Palette, Smartphone, Globe, Mail, Github, Sparkles, Terminal, Package, FileOutput, Layers2, BarChart3, Keyboard } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function ReleaseNotes() {
  return (
    <Layout>
      {/* Complex Layered Background (Matches Home) */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow opacity-30"></div>
        <div className="absolute bottom-[0%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow opacity-20"></div>
      </div>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">

          {/* Hero Section */}
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-6 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]">
              <Sparkles className="h-3.5 w-3.5" />
              Latest Release
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Release Notes
            </h1>

            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed font-light">
              Discover all the powerful features that make StableJSON the ultimate JSON processing tool
            </p>
          </div>

          {/* Current Release Card - v1.5 */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
              {/* Glowing top highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

              <CardHeader className="pb-8 border-b border-border/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <Badge variant="default" className="text-xs font-mono px-3 py-1 bg-primary text-primary-foreground rounded-md shadow-lg">
                    🎉 Latest Release
                  </Badge>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Terminal className="w-3.5 h-3.5" />
                    Released: January 2025
                  </div>
                </div>

                <CardTitle className="text-3xl font-bold flex items-center gap-4 tracking-tight">
                  <div className="p-2.5 rounded-xl bg-primary/20 ring-1 ring-primary/30 shadow-[0_0_20px_-3px_rgba(var(--primary),0.4)]">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  Version 1.5.0 <span className="text-muted-foreground font-normal ml-2 text-lg">- Performance & Power</span>
                </CardTitle>

                <CardDescription className="text-lg mt-4 text-muted-foreground/90 font-light pl-1 pt-2">
                  Major performance improvements, enhanced diff viewer, custom validation, keyboard navigation, batch processing, and advanced export capabilities
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-12 pt-8">
                {/* New v1.5 Features Grid */}
                <div className="grid md:grid-cols-2 gap-10">

                  {/* Performance Optimization */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                        <Zap className="h-4 w-4 text-green-500" />
                      </div>
                      Performance Engine
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "50% Faster Processing", desc: "Web Workers for non-blocking operations" },
                        { title: "60% Less Memory", desc: "Streaming algorithms for large files" },
                        { title: "Real-time Metrics", desc: "Performance monitoring and optimization" },
                        { title: "Smart Processing", desc: "Debounced input and throttled operations" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Diff & Validation */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                        <Layers2 className="h-4 w-4 text-amber-500" />
                      </div>
                      Enhanced Analysis
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "Enhanced Diff Viewer", desc: "4 view modes with advanced filtering" },
                        { title: "Custom Validation", desc: "Rule-based validation with JSONPath" },
                        { title: "Export Diff Results", desc: "Save comparison reports as JSON" },
                        { title: "Interactive Sections", desc: "Expandable diff with context control" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                        <Keyboard className="h-4 w-4 text-blue-500" />
                      </div>
                      Accessibility & Navigation
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "15+ Keyboard Shortcuts", desc: "Complete keyboard control" },
                        { title: "Arrow Navigation", desc: "Navigate UI with arrow keys" },
                        { title: "Screen Reader Support", desc: "Full WCAG 2.1 AA compliance" },
                        { title: "Focus Management", desc: "Smart focus trapping and restoration" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Batch Processing & Export */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                        <Package className="h-4 w-4 text-purple-500" />
                      </div>
                      Batch & Export
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "Multi-file Processing", desc: "Handle hundreds of JSON files" },
                        { title: "8 Export Formats", desc: "JSON, YAML, XML, CSV, TOML, and more" },
                        { title: "Progress Tracking", desc: "Real-time status and performance" },
                        { title: "ZIP Export", desc: "Bundle results with detailed reports" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="pt-8 mt-8 border-t border-border/40">
                  <h3 className="font-semibold text-lg mb-6 flex items-center gap-3 text-foreground">
                    <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                      <BarChart3 className="h-4 w-4 text-indigo-500" />
                    </div>
                    Performance Improvements
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "50% Faster", desc: "JSON processing speed" },
                      { title: "60% Less Memory", desc: "For large file handling" },
                      { title: "30% Faster Load", desc: "Initial application startup" },
                      { title: "15% Smaller", desc: "Production bundle size" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:to-indigo-500/15 transition-all duration-300">
                        <p className="font-bold text-lg mb-1 text-indigo-500">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previous Release Card - v1.0 */}
          <div className="mb-20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="border border-white/10 bg-card/20 backdrop-blur-xl shadow-xl overflow-hidden relative group opacity-80">
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent opacity-50"></div>

              <CardHeader className="pb-8 border-b border-border/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <Badge variant="outline" className="text-xs font-mono px-3 py-1 bg-muted/50 text-muted-foreground border-muted-foreground/20 rounded-md">
                    Previous Version
                  </Badge>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Terminal className="w-3.5 h-3.5" />
                    Released: December 2024
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold flex items-center gap-4 tracking-tight text-muted-foreground">
                  <div className="p-2.5 rounded-xl bg-muted/20 ring-1 ring-muted-foreground/20">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  Version 1.0.0 <span className="text-muted-foreground/70 font-normal ml-2 text-base">- Foundation Release</span>
                </CardTitle>

                <CardDescription className="text-base mt-4 text-muted-foreground/70 font-light pl-1 pt-2">
                  The complete JSON processing suite that started it all - with advanced features and privacy-first design
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-12 pt-8">
                {/* Feature Categories Grid */}
                <div className="grid md:grid-cols-2 gap-10">

                  {/* Core Processing */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                        <Zap className="h-4 w-4 text-blue-500" />
                      </div>
                      Core JSON Processing
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "JSON Validation", desc: "Real-time syntax validation with detailed error messages" },
                        { title: "Format & Beautify", desc: "Intelligent formatting with customizable indentation" },
                        { title: "Minify & Clean", desc: "Compress JSON and remove null/empty values" },
                        { title: "Sort & Canonicalize", desc: "Alphabetical sorting and deterministic output" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Analysis */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                        <Code className="h-4 w-4 text-emerald-500" />
                      </div>
                      Advanced Analysis
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "JSON Diff", desc: "Side-by-side comparison with highlighted differences" },
                        { title: "Path Inspector", desc: "Navigate complex structures and extract data paths" },
                        { title: "JSONPath Queries", desc: "Query data using JSONPath expressions" },
                        { title: "Interactive Tree View", desc: "Collapsible JSON viewer for large documents" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy & Security */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                        <Shield className="h-4 w-4 text-purple-500" />
                      </div>
                      Privacy & Security
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "Client-Side Processing", desc: "All operations happen locally in your browser" },
                        { title: "No Data Collection", desc: "Zero tracking, analytics, or data transmission" },
                        { title: "Offline Support", desc: "Complete functionality without internet" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Experience */}
                  <div className="space-y-5">
                    <h3 className="font-semibold text-lg flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                        <Palette className="h-4 w-4 text-orange-500" />
                      </div>
                      User Experience
                    </h3>
                    <div className="space-y-4 pl-2">
                      {[
                        { title: "Command Palette", desc: "Quick access with ⌘K / Ctrl+K shortcuts" },
                        { title: "Dark/Light Mode", desc: "Seamless theme switching" },
                        { title: "Responsive Design", desc: "Optimized for all devices" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <div>
                            <p className="font-medium text-sm text-foreground/90">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Code Generation & Export - Tech Card Style */}
                <div className="pt-8 mt-8 border-t border-border/40">
                  <h3 className="font-semibold text-lg mb-6 flex items-center gap-3 text-foreground">
                    <div className="p-2 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                      <Code className="h-4 w-4 text-indigo-500" />
                    </div>
                    Code Generation & Export
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "TypeScript Interfaces", desc: "Auto-generate type definitions" },
                      { title: "Zod Schemas", desc: "Runtime validation schemas" },
                      { title: "JSON Schema", desc: "Infer schema specifications" },
                      { title: "CSV Export", desc: "Convert arrays to CSV" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-background/40 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300">
                        <p className="font-medium text-sm mb-1 text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-16 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

          {/* Support Section */}
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Need Help or Have Feedback?</h3>
            <p className="text-muted-foreground/80 mb-10 max-w-2xl mx-auto font-light">
              We're here to help! Reach out for support, bug reports, or feature suggestions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:debjitdey450@gmail.com"
                className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] transition-all duration-300 font-semibold tracking-tight text-sm"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
              <a
                href="https://github.com/debjit450/stablejson"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-lg border border-primary/20 bg-background/40 backdrop-blur-md hover:bg-background/60 hover:border-primary/40 transition-all duration-300 font-medium text-sm"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}