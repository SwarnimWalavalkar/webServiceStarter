import {
  InferInsertModel,
  InferSelectModel,
  getTableColumns,
} from "drizzle-orm";
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id"),
  name: text("name").notNull(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  roles: text("roles")
    .$type<"admin" | "user">()
    .array()
    .default(["'{user}'"])
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type CookieUser = Pick<User, "username" | "roles">;

export type UserAttributes = Omit<
  User,
  "id" | "password" | "created_at" | "updated_at"
>;

export const userAttrPartialSelectColumns: {
  [k in keyof UserAttributes]: true;
} = {
  name: true,
  username: true,
  email: true,
  roles: true,
} as const;

const {
  id: _id,
  password: _password,
  created_at: _created_at,
  updated_at: _updated_at,
  ...restUserCols
} = getTableColumns(users);

export const userAttrReturningColumns = restUserCols;
