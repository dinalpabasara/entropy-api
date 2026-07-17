# The Entropy API

**Data decays. Memories fade. Observe or lose them.**

The Entropy API is a living data ecosystem where every piece of data has a digital half-life. Unobserved memories rot — text corrupts into noise — until they die and are deleted forever. It's a commentary on digital impermanence, human memory, and the cost of data storage.

Unlike every other API that stores data perfectly forever, the Entropy API lets entropy win.

## How It Works

- **Create** a memory via `POST /memories` (requires API key)
- **Observe** it via `GET /memories/{id}` to restore health
- **Upvote** it to stabilize it further
- **Neglect** it, and it decays each hour — text rots, health drops
- **Death** at 0 health — the memory is gone forever

The public feed (`GET /explore`) lets anyone watch memories decay in real-time.

## Quick Start

### 1. Get a Free API Key

```bash
curl -X POST https://entropy-api.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "My App"}'
```

Response:
```json
{
  "api_key": "ent_a1b2c3d4e5f6...",
  "message": "Store this key securely. It will not be shown again."
}
```

### 2. Create a Memory

```bash
curl -X POST https://entropy-api.railway.app/memories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ent_your_key_here" \
  -d '{"content": "This memory will decay without observation"}'
```

### 3. Observe to Restore Health

```bash
curl https://entropy-api.railway.app/memories/<MEMORY_ID> \
  -H "X-API-Key: ent_your_key_here"
```

### 4. Browse the Decay

```bash
curl https://entropy-api.railway.app/explore?limit=20
```

## API Reference

### Authentication

All `POST /memories`, `GET /memories/{id}`, and `POST /memories/{id}/upvote` endpoints require an `X-API-Key` header.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/register` | POST | No | Get a free API key |
| `/auth/info` | GET | Yes | Check your key status |
| `/auth/revoke` | POST | Yes | Revoke your key |
| `/memories` | POST | Yes | Create a memory |
| `/memories/{id}` | GET | Yes | Observe a memory (+5 health) |
| `/memories/{id}/upvote` | POST | Yes | Stabilize a memory (+15 health) |
| `/explore` | GET | No | Browse decaying memories |
| `/explore/cemetery` | GET | No | View dead memories |

### Rate Limiting

- Free tier: **100 requests/hour** per API key
- Reset: hourly

## Self-Hosting

### Docker (recommended)

```bash
git clone https://github.com/dinalpabasara/entropy-api.git
cd entropy-api/backend
docker-compose up
```

### Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Built With

- **FastAPI** — Python async API framework
- **SQLAlchemy** — Async ORM (PostgreSQL / SQLite)
- **Celery + Redis** — Background decay scheduler
- **Next.js 14** — React frontend with terminal aesthetic
- **Tailwind CSS** — Glitch-art styling

## The Philosophy

> "Every line of code, every byte stored, every memory digitized — it all fights against entropy. But entropy always wins. The Entropy API just makes that visible."

## License

MIT
