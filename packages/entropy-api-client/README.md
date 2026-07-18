# entropy-api-client

> JavaScript client for the [Entropy API](https://entropy-api-production-81ba.up.railway.app) — data decays when unobserved.

```bash
npm install entropy-api-client
```

## Usage

```ts
import { EntropyClient } from 'entropy-api-client'

const client = new EntropyClient()

// Register for a free API key
const apiKey = await client.register('My App')
// → "ent_a1b2c3d4e5f6..."

// Create a memory
const memory = await client.createMemory('Hello world', apiKey)
// → { id: "...", content: "Hello world", health_score: 100, ... }

// Observe it (restores +5 health)
await client.observe(memory.id, apiKey)

// Upvote/stabilize it (restores +15 health)
await client.upvote(memory.id, apiKey)

// Browse all decaying memories (no key needed)
const feed = await client.explore()
// → [{ content: "He#lo W%rld", health_score: 45, ... }, ...]

// Visit the cemetery
const dead = await client.cemetery()
// → [{ original_content: "...", died_at: "..." }]
```

## API

All methods return promises.

| Method | Auth? | Description |
|---|---|---|
| `register(name?)` | No | Get a free API key |
| `createMemory(content, apiKey, type?)` | Yes | Store a memory |
| `observe(id, apiKey)` | Yes | Read & restore health |
| `upvote(id, apiKey)` | Yes | Stabilize a memory |
| `explore(limit?, includeDead?)` | No | Browse decaying feed |
| `cemetery(limit?)` | No | View dead memories |

## Custom API URL

```ts
const client = new EntropyClient('https://your-instance.up.railway.app')
```
