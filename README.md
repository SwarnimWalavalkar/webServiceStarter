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

Setup .env from the default values in [.env.development](.env.development)

```
cp .env.development .env
```

Install node dependencies

```
pnpm i
```

Start dependencies in docker

```
make start
```

## Running the service

Run tests

```
pnpm run test
```

Start the development server

```
pnpm run dev
```

Or, start the service alongside all dependencies in docker

```
make start-all
```

The service will start listening on port `4001`

## Managing database Migrations

Migrations files are tracked in the [/migrations](/migrations) directory

```
make migrate [...args]

up [N]        Apply all or N up migrations
down [N]      Apply all or N down migrations

create NAME   Create a set of timestamped up/down migrations titled NAME
```

Migrations are internally handled with [https://github.com/golang-migrate/migrate](https://github.com/golang-migrate/migrate)

---

# Using as a template

- Find and replace all occurrences of `starter-service` to whatever other name you'd prefer for your project.
- Update [`src/config/index.ts`](src/config/index.ts) to update default app configuration

---

> This project was bootstrapped from [github.com/SwarnimWalavalkar/webServiceStarter](https://github.com/SwarnimWalavalkar/webServiceStarter)
