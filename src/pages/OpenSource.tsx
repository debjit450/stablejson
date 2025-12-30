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
            StableJSON is designed as a small, dependable utility. The goal is to
            keep the codebase understandable, predictable, and easy to maintain
            over time.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Features are added only when they improve correctness or usability.
            The project avoids unnecessary abstraction, configuration, or
            dependency growth.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            The codebase intentionally prioritizes:
          </p>

          <ul className="space-y-2 my-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Deterministic and predictable behavior</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Readable, straightforward implementation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 shrink-0" />
              <span>Long-term maintainability over rapid iteration</span>
            </li>
          </ul>

          <p className="text-muted-foreground leading-relaxed">
            StableJSON aims to remain useful years from now, without requiring
            frequent rewrites or constant feature churn.
          </p>
        </article>
      </div>
    </Layout>
  );
}
