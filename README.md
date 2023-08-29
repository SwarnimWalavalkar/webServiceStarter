# An opinionated backend web service scaffolding

An ever evolving starting point for wonderful ideas...

## Tools used

- Fastify
- Zod
- Drizzle
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

> Note: the tests dont work and I'm too lazy to fix 'em
