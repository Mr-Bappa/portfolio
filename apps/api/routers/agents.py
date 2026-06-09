from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from agents.chat_agent import get_chat_response

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    reply, sources = await get_chat_response(body.messages)
    return ChatResponse(reply=reply, sources=sources)
