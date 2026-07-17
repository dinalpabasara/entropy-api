from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import memories, explore, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Entropy API",
    description="The Living Data Ecosystem — memories decay when unobserved.",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(memories.router)
app.include_router(explore.router)


@app.get("/")
async def root():
    return {
        "name": "Entropy API",
        "tagline": "Data decays. Memories fade. Observe or lose them.",
        "version": "0.2.0",
        "docs": "/docs",
        "auth": {
            "register": "POST /auth/register — get a free API key",
            "info": "GET /auth/info — check your key (requires X-API-Key header)",
            "revoke": "POST /auth/revoke — revoke your key",
        },
        "endpoints": {
            "POST /memories": "Create a memory (auth required)",
            "GET /memories/{id}": "Observe a memory, restores health (auth required)",
            "POST /memories/{id}/upvote": "Stabilize a memory (auth required)",
            "GET /explore": "Browse all decaying memories (public)",
            "GET /explore/cemetery": "View dead memories (public)",
        },
    }


@app.get("/health")
async def health():
    return {"status": "alive", "entropy": "rising"}
