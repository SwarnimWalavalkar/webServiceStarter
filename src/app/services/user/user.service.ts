import { db } from "../../../dependencies/db";
import { User, UserInsert, users } from "../../../schema/user";
import logger from "../../../utils/logger";
import { or, eq } from "drizzle-orm";
import { ServiceError } from "../../../shared/errors";
import { Err, Ok, Result } from "../../../shared/result";

class UserServiceError extends ServiceError {
  constructor(message: string, source?: string) {
    super("User Service Error", message, source);
    this.name = this.constructor.name;
  }
}

export async function createUser(
  user: UserInsert
): Promise<Result<User, UserServiceError>> {
  try {
    const createdUser = (await db.insert(users).values(user).returning())[0];

    if (!createUser) {
      Err(new UserServiceError("Error creating new user", createUser.name));
    }

    return Ok(createdUser as User);
  } catch (error) {
    logger.error("[User Service] Error creating a new user", error);
    throw error;
  }
}

export async function getUserByUsernameOrEmail(
  usernameOrEmail: string
): Promise<Result<User, UserServiceError>> {
  try {
    const user = await db.query.users.findFirst({
      where: or(
        eq(users.username, usernameOrEmail),
        eq(users.email, usernameOrEmail)
      ),
    });

    if (!user) {
      return Err(
        new UserServiceError("User not found", getUserByUsernameOrEmail.name)
      );
    }

    return Ok(user);
  } catch (error) {
    logger.error("[User Service] Error getting user by username", error);
    throw error;
  }
}

export async function updateUser(
  usernameOrEmail: string,
  userAttr: Partial<UserInsert>
): Promise<Result<User, UserServiceError>> {
  try {
    const foundUser = await db.query.users.findFirst({
      columns: { id: true },
      where: or(
        eq(users.username, usernameOrEmail),
        eq(users.email, usernameOrEmail)
      ),
    });

    if (!foundUser) {
      Err(new UserServiceError("User not found", updateUser.name));
    }

    const updatedUser = (
      await db
        .update(users)
        .set(userAttr)
        .where(
          or(
            eq(users.username, usernameOrEmail),
            eq(users.email, usernameOrEmail)
          )
        )
        .returning()
    )[0] as User;

    return Ok(updatedUser);
  } catch (error) {
    logger.error("[User Service] Error updating user", error);
    throw error;
  }
}
