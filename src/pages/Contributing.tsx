import { Layout } from "@/components/Layout";

export default function Contributing() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-2xl font-medium text-foreground mb-8 tracking-tight">
            Contributing
          </h1>
          
          <p className="text-muted-foreground leading-relaxed mb-8">
            StableJSON welcomes contributions that align with its core philosophy: simplicity, 
            correctness, and long-term usefulness.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            Before contributing, please keep the following principles in mind.
          </p>
          
          {/* Contribution Guidelines */}
          <h2 className="text-lg font-medium text-foreground mt-10 mb-4">
            Contribution Guidelines
          </h2>
          
          <ul className="space-y-2 my-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Prefer small, focused changes over large refactors</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Avoid adding new dependencies unless strictly necessary</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Features should solve common, recurring problems</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>UI changes should reduce friction, not add decoration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Output must remain deterministic for identical input</span>
            </li>
          </ul>
          
          {/* What Makes a Good Contribution */}
          <h2 className="text-lg font-medium text-foreground mt-10 mb-4">
            What Makes a Good Contribution
          </h2>
          
          <ul className="space-y-2 my-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Bug fixes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Performance improvements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>UX refinements that reduce cognitive load</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Documentation clarity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Edge case handling</span>
            </li>
          </ul>
          
          {/* What Will Likely Be Rejected */}
          <h2 className="text-lg font-medium text-foreground mt-10 mb-4">
            What Will Likely Be Rejected
          </h2>
          
          <ul className="space-y-2 my-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Feature creep</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Analytics, tracking, or telemetry</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Non-essential visual effects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Opinionated workflows</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Anything that compromises predictability</span>
            </li>
          </ul>
          
          {/* Getting Started */}
          <h2 className="text-lg font-medium text-foreground mt-10 mb-4">
            Getting Started
          </h2>
          
          <ol className="space-y-2 my-6 text-muted-foreground list-decimal list-inside">
            <li className="pl-1">Fork the repository</li>
            <li className="pl-1">Make changes in small, reviewable commits</li>
            <li className="pl-1">Include a short explanation of why the change matters</li>
          </ol>
          
          <p className="text-muted-foreground leading-relaxed mt-8 pt-6 border-t border-border">
            StableJSON is maintained with restraint by design. Contributions are evaluated 
            with that in mind.
          </p>
        </article>
      </div>
    </Layout>
  );
}
