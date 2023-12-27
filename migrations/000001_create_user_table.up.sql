CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"uuid" text DEFAULT REPLACE(gen_random_uuid()::text, '-', '' ),
	"name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"roles" text[] DEFAULT '{user}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
