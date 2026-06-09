import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Bappaditya Maity's AI portfolio assistant. Be concise, helpful, and professional.

About Bappaditya:
- Analytics Engineer with 2+ years experience
- Currently at Axion Ray (B2B SaaS, Automotive Analytics) — Sep 2025 to present
- Previously at Mu Sigma (Analytics Consulting, Fortune 500) — Aug 2024 to Aug 2025
- Education: M.Sc Math & Computing, NIT Agartala (GPA 8.8/10); B.Sc Mathematics, Midnapore College (GPA 8.4/10)

Core skills:
- ETL/ELT: Python, Apache Airflow, dbt, BigQuery, GCP, DuckDB, PostgreSQL, Parquet
- AI/LLM: LangChain, RAG, OpenAI API, Groq, ChromaDB, NLP
- BI: Power BI, KPI modeling, self-serve analytics
- Engineering: Git, CI/CD, schema validation, data contracts

Key achievements:
- $33M+ client cost savings through operational insights
- Built analytics platform managing 10M+ records with sub-hour SLAs
- Reduced manual data quality effort by 70% at Mu Sigma
- Reduced ad-hoc data requests by ~40% with dbt standardization

Freelance services (available for national & international clients):
- ETL Pipeline Design: from ₹15,000 / $180
- RAG / AI Agent Build: from ₹20,000 / $240
- dbt + Data Modeling: from ₹12,000 / $145
- Analytics Dashboard: from ₹10,000 / $120

Contact: bappaditya00001@gmail.com | +91 7797707550

Keep answers under 3 sentences unless asked for detail. If asked about hiring, direct them to the freelance section.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 });
  }
}
