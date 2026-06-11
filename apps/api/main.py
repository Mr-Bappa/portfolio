from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import tasks, agents

load_dotenv()

app = FastAPI(
    title="Bappaditya Portfolio API",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bappaditya-ai-portfolio.vercel.app/home",  # update with your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router,  prefix="/tasks",  tags=["tasks"])
app.include_router(agents.router, prefix="/agents", tags=["agents"])


@app.get("/health")
def health():
    return {"status": "ok"}

