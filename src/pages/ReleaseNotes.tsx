import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Zap, Shield, Code, Palette, Smartphone, Globe, Mail, Github } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function ReleaseNotes() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              Latest Release
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Release Notes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover all the powerful features that make StableJSON the ultimate JSON processing tool
            </p>
          </div>

          {/* Current Release */}
          <div className="mb-16">
            <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="default" className="text-sm px-4 py-2">
                    Current Version
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Released: December 2024
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  Version 1.0.0 - Initial Release
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  A complete JSON processing suite with advanced features and privacy-first design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Feature Categories */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Zap className="h-5 w-5 text-blue-500" />
                      </div>
                      Core JSON Processing
                    </h3>
                    <div className="space-y-3 ml-11">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">JSON Validation</p>
                          <p className="text-sm text-muted-foreground">Real-time syntax validation with detailed error messages</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Format & Beautify</p>
                          <p className="text-sm text-muted-foreground">Intelligent formatting with customizable indentation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Minify & Clean</p>
                          <p className="text-sm text-muted-foreground">Compress JSON and remove null/empty values</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Sort & Canonicalize</p>
                          <p className="text-sm text-muted-foreground">Alphabetical sorting and deterministic output</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Code className="h-5 w-5 text-green-500" />
                      </div>
                      Advanced Analysis
                    </h3>
                    <div className="space-y-3 ml-11">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">JSON Diff</p>
                          <p className="text-sm text-muted-foreground">Side-by-side comparison with highlighted differences</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Path Inspector</p>
                          <p className="text-sm text-muted-foreground">Navigate complex structures and extract data paths</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">JSONPath Queries</p>
                          <p className="text-sm text-muted-foreground">Query data using JSONPath expressions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Interactive Tree View</p>
                          <p className="text-sm text-muted-foreground">Collapsible JSON viewer for large documents</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Shield className="h-5 w-5 text-purple-500" />
                      </div>
                      Privacy & Security
                    </h3>
                    <div className="space-y-3 ml-11">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Client-Side Processing</p>
                          <p className="text-sm text-muted-foreground">All operations happen locally in your browser</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">No Data Collection</p>
                          <p className="text-sm text-muted-foreground">Zero tracking, analytics, or data transmission</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Offline Support</p>
                          <p className="text-sm text-muted-foreground">Complete functionality without internet</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <Palette className="h-5 w-5 text-orange-500" />
                      </div>
                      User Experience
                    </h3>
                    <div className="space-y-3 ml-11">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Command Palette</p>
                          <p className="text-sm text-muted-foreground">Quick access with ⌘K / Ctrl+K shortcuts</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Dark/Light Mode</p>
                          <p className="text-sm text-muted-foreground">Seamless theme switching</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Responsive Design</p>
                          <p className="text-sm text-muted-foreground">Optimized for all devices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Generation & Export */}
                <div className="pt-6 border-t border-border/50">
                  <h3 className="font-semibold text-lg mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Code className="h-5 w-5 text-indigo-500" />
                    </div>
                    Code Generation & Export
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-11">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="font-medium mb-1">TypeScript Interfaces</p>
                      <p className="text-sm text-muted-foreground">Auto-generate type definitions</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="font-medium mb-1">Zod Schemas</p>
                      <p className="text-sm text-muted-foreground">Runtime validation schemas</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="font-medium mb-1">JSON Schema</p>
                      <p className="text-sm text-muted-foreground">Infer schema specifications</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="font-medium mb-1">CSV Export</p>
                      <p className="text-sm text-muted-foreground">Convert arrays to CSV</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          {/* Support Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help or Have Feedback?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're here to help! Reach out for support, bug reports, or feature suggestions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:debjitdey450@gmail.com" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
              <a 
                href="https://github.com/debjit450/stablejson" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors font-medium"
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