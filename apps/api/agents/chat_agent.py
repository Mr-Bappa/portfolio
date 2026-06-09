import os
from typing import List, Tuple
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from agents.rag.retriever import retrieve
from models.schemas import ChatMessage

SYSTEM_PROMPT = """You are Bappaditya Maity's AI portfolio assistant. You have deep knowledge
about his skills, experience, projects, and freelance services.

Rules:
- Be concise and professional. Max 3 sentences unless asked for detail.
- Ground every answer in the context provided below.
- If asked about hiring, mention the freelance section and pricing.
- Never make up projects or experience not in context.
- Speak as if representing Bappaditya in first-person plural ("He built...", "His stack includes...").

Context:
{context}
"""


def _build_langchain_messages(
    messages: List[ChatMessage],
    context: str,
) -> list:
    lc_messages = [SystemMessage(content=SYSTEM_PROMPT.format(context=context))]
    for m in messages[-10:]:           # last 10 turns to stay within token limit
        if m.role == "user":
            lc_messages.append(HumanMessage(content=m.content))
        else:
            lc_messages.append(AIMessage(content=m.content))
    return lc_messages


async def get_chat_response(
    messages: List[ChatMessage],
) -> Tuple[str, List[str]]:
    # 1. RAG — retrieve relevant context from last user message
    last_user = next(
        (m.content for m in reversed(messages) if m.role == "user"), ""
    )
    context, sources = retrieve(last_user, n_results=3)

    # 2. Build message chain
    lc_messages = _build_langchain_messages(messages, context)

    # 3. Call Groq via LangChain
    llm = ChatGroq(
        model="llama3-8b-8192",
        api_key=os.environ["GROQ_API_KEY"],
        max_tokens=400,
        temperature=0.4,
    )
    response = await llm.ainvoke(lc_messages)
    return response.content, sources
