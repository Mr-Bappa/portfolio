from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class TaskStatus(str, Enum):
    pending     = "pending"
    paid        = "paid"
    in_progress = "in_progress"
    review      = "review"
    completed   = "completed"
    cancelled   = "cancelled"


class TaskUpdateRequest(BaseModel):
    status:          Optional[TaskStatus] = None
    notes:           Optional[str]        = None
    deliverable_url: Optional[str]        = None


class ChatMessage(BaseModel):
    role:    str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply:      str
    sources:    List[str] = []
