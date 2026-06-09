from fastapi import APIRouter, HTTPException, Header
from models.schemas import TaskUpdateRequest
from supabase import create_client
import os

router = APIRouter()

def get_db():
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    )

def verify_admin(x_admin_key: str = Header(...)):
    if x_admin_key != os.environ.get("ADMIN_SECRET_KEY"):
        raise HTTPException(status_code=403, detail="Forbidden")


@router.get("/")
def list_tasks(x_admin_key: str = Header(...)):
    verify_admin(x_admin_key)
    db = get_db()
    res = db.table("tasks").select(
        "*, profiles(name, email)"
    ).order("created_at", desc=True).execute()
    return {"tasks": res.data}


@router.patch("/{task_id}")
def update_task(
    task_id: str,
    body: TaskUpdateRequest,
    x_admin_key: str = Header(...),
):
    verify_admin(x_admin_key)
    db = get_db()

    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = db.table("tasks").update(updates).eq("id", task_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"task": res.data[0]}


@router.get("/{task_id}")
def get_task(task_id: str, x_admin_key: str = Header(...)):
    verify_admin(x_admin_key)
    db = get_db()
    res = db.table("tasks").select(
        "*, profiles(name, email), payments(*)"
    ).eq("id", task_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"task": res.data}
