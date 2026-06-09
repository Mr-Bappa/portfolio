"""
Run once to ingest resume + project docs into ChromaDB.
Usage: python -m agents.rag.ingest
"""
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

RESUME_CHUNKS = [
    {
        "id": "summary",
        "text": (
            "Bappaditya Maity is an Analytics Engineer with 2+ years of experience "
            "designing and scaling production-grade ELT/ETL pipelines, dimensional data models, "
            "and self-service analytics solutions. Proficient in Python, Advanced SQL, dbt, "
            "BigQuery, Apache Airflow, and Google Cloud Platform. Experienced in mathematical "
            "KPI formulation, statistical analysis, and hypothesis testing."
        ),
    },
    {
        "id": "experience_axion",
        "text": (
            "At Axion Ray (B2B SaaS, Automotive Analytics), Bappaditya works as an Analytics Engineer "
            "since September 2025. He partnered with product and engineering to define KPI frameworks "
            "contributing to $33M+ in client cost savings. Built an automated analytics data platform "
            "using Python, GCS ingestion, Parquet storage, and DuckDB managing 10M+ records. "
            "Built LLM and NLP pipelines using OpenAI API to transform unstructured operational records "
            "into structured business insights. Established dbt data contracts reducing ad-hoc requests by 40%."
        ),
    },
    {
        "id": "experience_musigma",
        "text": (
            "At Mu Sigma (Analytics Consulting, Fortune 500 Clients), Bappaditya worked as a "
            "Decision Scientist from August 2024 to August 2025. Designed cloud-based ELT pipelines "
            "on BigQuery and GCS using Apache Airflow, reducing manual data quality effort by 70%. "
            "Built self-service analytics using Power BI and PyDash. Applied hypothesis testing "
            "including Chi-Square tests for business decision-making."
        ),
    },
    {
        "id": "project_etl",
        "text": (
            "ETL Analytics Automation Pipeline project: Architected a production-grade ELT/ETL system "
            "using Python, PostgreSQL, Apache Airflow, and dbt with modular staging, transformation, "
            "and serving layers across 5+ data sources, processing 1M+ records with sub-hour SLAs. "
            "Enforced reliability through dbt tests, schema validation, and structured error alerting."
        ),
    },
    {
        "id": "project_dashboard",
        "text": (
            "Product Analytics Executive Dashboard: Designed a Star Schema dimensional data model "
            "with fact and dimension tables using SQL, dbt, and Python. Delivered a Power BI dashboard "
            "tracking 20+ business KPIs with role-based access and scheduled refresh."
        ),
    },
    {
        "id": "project_rag",
        "text": (
            "AI-Powered Business Insights Assistant: Built and deployed a RAG-powered conversational "
            "analytics app using Python, OpenAI, and Streamlit. Implemented vector-based semantic search "
            "grounding LLM responses in source data across 100+ CSV/Excel datasets."
        ),
    },
    {
        "id": "skills",
        "text": (
            "Skills: dbt, Advanced SQL, Data Warehousing, ELT/ETL Design, Dimensional Modeling, "
            "Star Schema, BigQuery, GCP, GCS, PostgreSQL, DuckDB, SQLite, Parquet, Python, "
            "Apache Airflow, Schema Validation, Data Quality Testing, Power BI, Statistical Analysis, "
            "Hypothesis Testing, A/B Testing, LLM-Assisted Pipelines, RAG, NLP, OpenAI API, "
            "Claude API, Git, GitHub, CI/CD."
        ),
    },
    {
        "id": "education",
        "text": (
            "Bappaditya studied M.Sc in Mathematics & Computing at NIT Agartala with GPA 8.8/10, "
            "graduating May 2024. Coursework: Statistical Inference, Probability Theory, "
            "Optimization Techniques, Machine Learning, Numerical Methods, Design & Analysis of Algorithms. "
            "Previously B.Sc in Mathematics from Midnapore College with GPA 8.4/10, June 2022."
        ),
    },
    {
        "id": "freelance",
        "text": (
            "Bappaditya is available for freelance work nationally and internationally. "
            "Services: ETL Pipeline Design from ₹15,000/$180, RAG/AI Agent Build from ₹20,000/$240, "
            "dbt + Data Modeling from ₹12,000/$145, Analytics Dashboard from ₹10,000/$120. "
            "Payment via Razorpay (India) or Stripe (international). Contact: bappaditya00001@gmail.com"
        ),
    },
]


def ingest():
    ef = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    client = chromadb.PersistentClient(path="./chroma_db")

    collection = client.get_or_create_collection(
        name="portfolio_rag",
        embedding_function=ef,
    )

    existing = collection.get()["ids"]

    for chunk in RESUME_CHUNKS:
        if chunk["id"] not in existing:
            collection.add(
                ids=[chunk["id"]],
                documents=[chunk["text"]],
            )
            print(f"  Ingested: {chunk['id']}")
        else:
            print(f"  Skipped (exists): {chunk['id']}")

    print(f"\nDone. Collection has {collection.count()} chunks.")


if __name__ == "__main__":
    ingest()
