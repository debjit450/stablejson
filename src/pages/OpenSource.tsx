import { Layout } from "@/components/Layout";

export default function OpenSource() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-2xl font-medium text-foreground mb-8 tracking-tight">
            Project Philosophy
          </h1>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            StableJSON is built with the assumption that foundational developer tools should 
            be inspectable, modifiable, and long-lived.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            The codebase favors clarity over cleverness, and stability over novelty. 
            Dependencies are kept minimal, and features are added conservatively to avoid 
            unnecessary surface area.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            The project prioritizes:
          </p>
          
          <ul className="space-y-2 my-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Deterministic behavior</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Readable implementation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Ease of maintenance over time</span>
            </li>
          </ul>
          
          <p className="text-muted-foreground leading-relaxed">
            StableJSON is intended to remain useful years from now, even as frameworks and 
            trends change.
          </p>
        </article>
      </div>
    </Layout>
  );
}
