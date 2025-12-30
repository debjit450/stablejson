import { Layout } from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-2xl font-medium text-foreground mb-8 tracking-tight">
            Runtime & Data Handling
          </h1>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            StableJSON is designed to run as a self-contained browser application.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            All transformations, comparisons, and inspections happen locally as part of the 
            page runtime. The application does not rely on external services to function.
          </p>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            Temporary browser storage may be used to preserve your last working state for 
            convenience. This data remains on your device and can be cleared at any time 
            using standard browser controls.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            StableJSON avoids unnecessary complexity and external dependencies so its behavior 
            is easy to reason about and verify.
          </p>
        </article>
      </div>
    </Layout>
  );
}
