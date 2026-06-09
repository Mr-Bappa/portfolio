import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from typing import List, Tuple

_client     = None
_collection = None


def _get_collection():
    global _client, _collection
    if _collection is None:
        ef = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        _client = chromadb.PersistentClient(path="./chroma_db")
        _collection = _client.get_or_create_collection(
            name="portfolio_rag",
            embedding_function=ef,
        )
    return _collection


def retrieve(query: str, n_results: int = 3) -> Tuple[str, List[str]]:
    """
    Returns (context_string, list_of_source_ids)
    """
    collection = _get_collection()

    if collection.count() == 0:
        return "", []

    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, collection.count()),
    )

    docs    = results["documents"][0]
    ids     = results["ids"][0]
    context = "\n\n".join(docs)
    return context, ids
