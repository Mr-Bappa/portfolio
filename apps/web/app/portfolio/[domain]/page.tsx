import { notFound }  from "next/navigation";
import { Navbar }    from "@/components/ui/Navbar";
import { Footer }    from "@/components/ui/Footer";
import Link          from "next/link";

type DomainContent = {
  title:       string;
  tagline:     string;
  description: string;
  whatIBuild:  string[];
  techStack:   string[];
  realWork:    { label: string; detail: string }[];
  cta:         string;
};

const DOMAIN_CONTENT: Record<string, DomainContent> = {
  etl: {
    title:       "ETL / ELT Pipelines",
    tagline:     "Production-grade data movement — from raw source to trusted mart.",
    description:
      "I design and build end-to-end ELT/ETL pipelines that are reliable, observable, and scalable. From GCS ingestion to BigQuery marts, every layer is schema-validated, tested, and alerting-enabled.",
    whatIBuild: [
      "Modular staging → transformation → serving architectures",
      "Apache Airflow DAGs with retry logic and failure alerting",
      "Parquet-optimised GCS ingestion layers",
      "DuckDB-backed historical audit layers for 10M+ record datasets",
      "Schema validation and data quality checks at every layer",
    ],
    techStack:  ["Python", "Apache Airflow", "dbt", "BigQuery", "GCS", "DuckDB", "PostgreSQL", "Parquet"],
    realWork: [
      { label: "Sub-hour SLAs",     detail: "Automated pipelines processing 1M+ records with consistent delivery windows" },
      { label: "–70% manual effort", detail: "Airflow orchestration eliminated manual ingestion and validation work at Mu Sigma" },
      { label: "–40% ad-hoc requests", detail: "dbt data contracts and governed models reduced downstream analyst interruptions at Axion Ray" },
    ],
    cta: "etl-pipeline",
  },
  agents: {
    title:       "AI Agent Creation",
    tagline:     "Agentic systems that reason, retrieve, and act on your data.",
    description:
      "I build LLM-powered agents grounded in your actual data — not hallucinations. Using RAG, tool use, and structured outputs, I turn unstructured operational data into automated intelligence.",
    whatIBuild: [
      "RAG pipelines over structured and unstructured data sources",
      "Conversational analytics assistants with vector-backed memory",
      "LLM + NLP pipelines for automated report generation",
      "Multi-tool agents using LangChain with custom tools",
      "Groq / OpenAI / Claude API integrations with streaming",
    ],
    techStack:  ["LangChain", "RAG", "ChromaDB", "Groq", "OpenAI API", "Python", "FastAPI", "Streamlit"],
    realWork: [
      { label: "OpenAI NLP at Axion Ray",  detail: "Transformed unstructured operational records into structured executive summaries" },
      { label: "RAG assistant (OSS)",       detail: "Natural language analysis across 100+ CSV/Excel datasets with semantic search" },
      { label: "AI portfolio assistant",    detail: "This very chatbot — RAG over resume docs, Groq inference, FastAPI backend" },
    ],
    cta: "rag-agent",
  },
  finetune: {
    title:       "LLM Fine-tuning",
    tagline:     "Domain-adapted models that speak your business language.",
    description:
      "General LLMs don't know your domain. Fine-tuning creates models that understand your data vocabulary, KPIs, and reasoning patterns — improving accuracy and reducing prompt engineering overhead.",
    whatIBuild: [
      "Dataset curation from operational logs, reports, and structured data",
      "Supervised fine-tuning pipelines (SFT) for domain adaptation",
      "Evaluation frameworks with task-specific benchmarks",
      "PEFT / LoRA fine-tuning for cost-efficient adaptation",
      "Deployment to inference endpoints (Groq, HuggingFace, vLLM)",
    ],
    techStack:  ["Python", "HuggingFace Transformers", "LoRA / PEFT", "Datasets", "Groq", "OpenAI API", "Weights & Biases"],
    realWork: [
      { label: "Domain vocabulary",  detail: "Custom training data from business-specific operational terminology" },
      { label: "Eval-driven tuning", detail: "Benchmark-first approach — define success metrics before touching training" },
      { label: "Cost-efficient",     detail: "LoRA adapters reduce GPU memory requirements by 60–80% vs full fine-tuning" },
    ],
    cta: "rag-agent",
  },
  modeling: {
    title:       "Dimensional Modeling",
    tagline:     "Clean, governed data models your analysts will actually trust.",
    description:
      "I design Star Schema dimensional models with clearly separated fact and dimension tables, governed business logic in dbt, and data contracts that make downstream analytics reliable and self-serve.",
    whatIBuild: [
      "Star Schema designs — fact tables, slowly changing dimensions (Type-2 SCD)",
      "dbt staging → intermediate → mart layer architectures",
      "Data contracts and schema tests enforced at CI level",
      "Reusable macros and documented models for self-serve analytics",
      "Churn, retention, cohort, and conversion funnel models",
    ],
    techStack:  ["dbt", "SQL", "BigQuery", "PostgreSQL", "DuckDB", "Python", "dbt tests"],
    realWork: [
      { label: "Axion Ray data platform", detail: "Standardized ELT workflows reducing ad-hoc requests by 40% across reporting layers" },
      { label: "Mu Sigma marts",           detail: "10+ high-volume relational tables into staging → marts powering consistent KPI reporting" },
      { label: "Type-2 SCD history",       detail: "Full historical tracking on dimension changes for accurate point-in-time analysis" },
    ],
    cta: "dbt-modeling",
  },
  bi: {
    title:       "BI Dashboards",
    tagline:     "Executives shouldn't wait days for a number.",
    description:
      "I build self-serve BI layers that give business stakeholders direct access to trusted KPIs — no analyst in the middle. Role-based access, scheduled refresh, and drillable dimensions.",
    whatIBuild: [
      "Power BI executive dashboards with 20+ KPI categories",
      "Self-serve analytics with role-based access control",
      "KPI frameworks aligned to business objectives",
      "Churn, retention, conversion, and revenue dashboards",
      "PyDash / Streamlit lightweight analytics apps",
    ],
    techStack:  ["Power BI", "SQL", "dbt", "Python", "PyDash", "Streamlit", "DAX"],
    realWork: [
      { label: "Days → hours",        detail: "Reduced stakeholder time-to-insight at Mu Sigma by consolidating 5+ KPI categories" },
      { label: "20+ KPI dashboard",   detail: "Executive Power BI with role-based access, scheduled refresh, and historical reporting" },
      { label: "Zero analyst bottleneck", detail: "Self-serve layer means business teams query directly without recurring analyst effort" },
    ],
    cta: "dashboard",
  },
  cloud: {
    title:       "Cloud Data Platforms",
    tagline:     "Scalable, auditable, cloud-native data infrastructure.",
    description:
      "I architect cloud data platforms on GCP that handle ingestion, storage optimisation, historical tracking, and lineage — so your data is always fresh, auditable, and cheap to query.",
    whatIBuild: [
      "GCS-based ingestion layers with Parquet columnar storage",
      "BigQuery warehouse design with partitioning and clustering",
      "DuckDB-backed local audit layers for fast historical queries",
      "End-to-end data lineage and observability",
      "Cost-optimised storage tiering strategies",
    ],
    techStack:  ["GCP", "BigQuery", "GCS", "DuckDB", "Parquet", "Python", "Apache Airflow"],
    realWork: [
      { label: "10M+ record platform", detail: "Parquet-optimised DuckDB audit layer managing full historical data at Axion Ray" },
      { label: "Full data lineage",     detail: "End-to-end traceability from raw GCS source to BigQuery mart" },
      { label: "Zero manual handoffs",  detail: "Automated daily ingestion eliminated all manual data delivery processes" },
    ],
    cta: "etl-pipeline",
  },
};

export function generateStaticParams() {
  return Object.keys(DOMAIN_CONTENT).map((d) => ({ domain: d }));
}

export default function DomainPage({ params }: { params: { domain: string } }) {
  const content = DOMAIN_CONTENT[params.domain];
  if (!content) notFound();

  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 font-mono text-xs text-dim">
          <Link href="/portfolio" className="hover:text-teal-light transition-colors">
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-muted">{content.title}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <p className="text-teal-light font-mono text-xs tracking-widest uppercase mb-3">
            Domain expertise
          </p>
          <h1 className="text-3xl font-medium text-white/90 mb-4">{content.title}</h1>
          <p className="text-teal-light text-base italic mb-4">{content.tagline}</p>
          <p className="text-muted text-base leading-relaxed">{content.description}</p>
        </div>

        {/* What I build */}
        <section className="mb-10">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-4">
            What I build
          </h2>
          <div className="glass rounded-xl p-6 flex flex-col gap-3">
            {content.whatIBuild.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-teal mt-0.5 flex-shrink-0">→</span>
                <p className="text-muted text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real work */}
        <section className="mb-10">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-4">
            Real results
          </h2>
          <div className="flex flex-col gap-3">
            {content.realWork.map((r) => (
              <div key={r.label} className="glass rounded-xl p-5 border-l-2 border-teal">
                <p className="text-teal-light font-mono text-sm font-medium mb-1">{r.label}</p>
                <p className="text-muted text-sm">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-12">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-4">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.techStack.map((t) => (
              <span key={t}
                    className="bg-teal-dark/20 border border-teal/20 text-teal-light
                               text-xs px-3 py-1.5 rounded-lg font-mono">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/90 text-base font-medium mb-2">
            Need this for your project?
          </p>
          <p className="text-muted text-sm mb-6">
            Let's scope it, price it, and ship it.
          </p>
          <Link
            href={`/freelance/create-task?service=${content.cta}`}
            className="inline-block bg-teal text-white px-8 py-3 rounded-xl text-sm
                       font-medium hover:bg-teal-dark transition-all"
          >
            Hire me for this →
          </Link>
        </div>

      </div>
      <Footer />
    </main>
  );
}
