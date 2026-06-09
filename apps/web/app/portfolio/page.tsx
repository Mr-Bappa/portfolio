import { Navbar }  from "@/components/ui/Navbar";
import { Footer }  from "@/components/ui/Footer";
import { PROFILE, JOURNEY, DOMAINS } from "@/lib/constants";

const PROJECTS = [
  {
    title:   "ETL Analytics Automation Pipeline",
    desc:    "Production-grade ELT/ETL system with modular staging → transformation → serving layers across 5+ data sources, processing 1M+ records with sub-hour SLAs.",
    stack:   ["Python", "Apache Airflow", "dbt", "PostgreSQL"],
    github:  "#",
    metrics: ["1M+ records", "Sub-hour SLA", "5+ sources"],
  },
  {
    title:   "Product Analytics Executive Dashboard",
    desc:    "Star Schema dimensional model powering churn analysis, retention cohorts, conversion funnels, and historical reporting through Type-2 SCD handling.",
    stack:   ["dbt", "SQL", "Power BI", "Python"],
    github:  "#",
    metrics: ["20+ KPIs", "Role-based access", "Type-2 SCD"],
  },
  {
    title:   "AI-Powered Business Insights Assistant",
    desc:    "RAG-powered conversational analytics app enabling natural language analysis across 100+ CSV/Excel datasets for KPI summaries, trend detection, and recommendations.",
    stack:   ["Python", "OpenAI", "ChromaDB", "Streamlit"],
    github:  "#",
    metrics: ["100+ datasets", "Vector search", "RAG pipeline"],
  },
];

const SKILLS_MAP = [
  {
    category: "Analytics Engineering",
    items: ["dbt", "Advanced SQL", "Dimensional Modeling", "Star Schema", "ELT/ETL Design", "KPI Modeling"],
  },
  {
    category: "Cloud & Data Platforms",
    items: ["BigQuery", "GCP", "GCS", "PostgreSQL", "DuckDB", "Parquet"],
  },
  {
    category: "Orchestration & Engineering",
    items: ["Apache Airflow", "Python", "Schema Validation", "Data Quality Testing", "CI/CD"],
  },
  {
    category: "AI & LLM",
    items: ["LangChain", "RAG", "OpenAI API", "Groq", "ChromaDB", "NLP"],
  },
  {
    category: "BI & Experimentation",
    items: ["Power BI", "A/B Testing", "Hypothesis Testing", "Chi-Square Tests", "Statistical Analysis"],
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-dim text-xs tracking-widest uppercase mb-3">Portfolio</p>
          <h1 className="text-3xl font-medium text-white/90 mb-4">
            {PROFILE.name}
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            {PROFILE.summary}
          </p>
        </div>

        {/* Experience timeline */}
        <section className="mb-16">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-6">
            Experience
          </h2>
          <div className="flex flex-col gap-4">
            {JOURNEY.slice().reverse().map((j) => (
              <div key={j.id} className="glass rounded-xl p-6 flex gap-6 items-start">
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center
                                  justify-center font-mono text-xs border
                                  ${j.color === "teal"
                                    ? "bg-teal-dark/30 border-teal/30 text-teal-light"
                                    : j.color === "amber"
                                    ? "bg-amber-dark/30 border-amber-dark/30 text-amber"
                                    : "bg-violet-dark/30 border-violet/30 text-violet-light"}`}>
                  {j.stop}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white/90 text-sm font-medium">{j.institution}</p>
                      <p className="text-muted text-sm">{j.degree}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-dim font-mono text-xs">{j.period}</p>
                      <p className="text-teal-light font-mono text-xs mt-1">{j.gpa}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {j.coursework.map((tag) => (
                      <span key={tag}
                            className="bg-void border border-border text-dim
                                       text-[10px] px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-6">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS_MAP.map((s) => (
              <div key={s.category} className="glass rounded-xl p-5">
                <p className="text-teal-light font-mono text-xs mb-3">{s.category}</p>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((skill) => (
                    <span key={skill}
                          className="bg-void border border-border text-muted
                                     text-xs px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-6">
            Projects
          </h2>
          <div className="flex flex-col gap-5">
            {PROJECTS.map((p) => (
              <div key={p.title} className="glass rounded-xl p-6 hover:border-teal/20 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-white/90 text-base font-medium">{p.title}</h3>
                  <a href={p.github}
                     className="text-dim text-xs font-mono hover:text-teal-light
                                transition-colors flex-shrink-0">
                    GitHub ↗
                  </a>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  {p.metrics.map((m) => (
                    <span key={m} className="text-teal-light font-mono text-xs">
                      ✓ {m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s}
                          className="bg-teal-dark/20 border border-teal/20 text-teal-light
                                     text-[10px] px-2 py-0.5 rounded font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Domain expertise links */}
        <section>
          <h2 className="text-white/80 font-mono text-xs tracking-widest uppercase mb-6">
            Domain deep-dives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAINS.map((d) => (
              <a key={d.id}
                 href={`/portfolio/${d.id}`}
                 className="glass rounded-xl p-5 hover:border-teal/30 transition-all group">
                <p className="text-white/80 text-sm font-medium mb-1 group-hover:text-teal-light transition-colors">
                  {d.title}
                </p>
                <p className="text-dim text-xs">{d.desc}</p>
                <p className="text-teal-light text-xs font-mono mt-3">Read more →</p>
              </a>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
