# An opinionated backend web service scaffolding

An ever evolving starting point for wonderful ideas...

## Tools used

- Fastify
- Zod
- Drizzle
- [Hermes](https://github.com/SwarnimWalavalkar/hermes) (my custom messaging library)
- Postgres
- Redis

## Setting Up

```
pnpm i
```

Running redis and postgres

```
docker compose -f docker/compose.yml up -d
```

Applying database migrations

```
pnpm run db:migrate
```

Making sure everything's fine

```
pnpm run db:check
```

Start the server

```
pnpm run dev
```

---
