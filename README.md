# 🚀 An opinionated backend web service scaffolding

An ever evolving starting point for wonderful ideas... ✨

## Tools used

- [Fastify](https://github.com/fastify/fastify)
- [Zod](https://github.com/colinhacks/zod)
- [Drizzle](https://github.com/drizzle-team/drizzle-orm)
- [Hermes](https://github.com/SwarnimWalavalkar/hermes) (a custom-built messaging library)
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Setting Up

```
pnpm i
```

Run dependencies

```
pnpm run docker:up
```

Apply database migrations

```
pnpm run db:migrate up
```

Run tests

```
pnpm run test
```

Start the development server

```
pnpm run dev
```

# Using as a template

- Find and replace all occurrences of `starter-service` to whatever other name you'd prefer for your project.
- Update [`src/config/index.ts`](src/config/index.ts) to update default app configuration

---

> This project was bootstrapped from [github.com/SwarnimWalavalkar/webServiceStarter](https://github.com/SwarnimWalavalkar/webServiceStarter)
