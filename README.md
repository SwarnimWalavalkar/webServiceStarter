# 🚀 An opinionated backend web service scaffolding

An ever evolving starting point for wonderful ideas...✨

## Tools used

- [Fastify](https://github.com/fastify/fastify)
- [Zod](https://github.com/colinhacks/zod)
- [Drizzle](https://github.com/drizzle-team/drizzle-orm)
- [Hermes](https://github.com/SwarnimWalavalkar/hermes)
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Setting Up

```
pnpm i
```

Running dependencies

```
docker compose -f docker/compose.yml up -d
```

Applying database migrations

```
pnpm run db:migrate
```

Check if the migrations were applied correctly

```
pnpm run db:check
```

Start the development server

```
pnpm run dev
```

---
