import md5 from "md5";
import { RunResult } from "sqlite3";
import {
  UNAUTHORIZED_MESSAGE,
  USER_EMAIL_USED_MESSAGE,
} from "../common/errorMessages";
import { MyContext } from "../server";
import { User, FullUser, CurrentUser } from "./types";

export function getUsers(__: any, context: MyContext): Promise<User[]> {
  const sql = "SELECT id,first_name,last_name,email,role FROM user";
  return context.db.all<User>(sql, []);
}

export function getUserById(id: string, context: MyContext): Promise<User> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`;
  return context.db.get<User>(sql, [id]);
}

export async function getUserByToken(context: MyContext): Promise<CurrentUser> {
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`;
  return context.db.get<CurrentUser>(sql, [context.req.headers["auth-token"]]);
}

export function checkForUser(email: string, context: MyContext): Promise<User> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = ?`;
  return context.db.get<User>(sql, [email]);
}

export async function createUser(
  user: FullUser,
  context: MyContext
): Promise<User> {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  context.db.run(sql, [
    user.id,
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.role,
  ]);
  return getUserById(user.id,context);
}

export async function updateUser(
  user: FullUser,
  context: MyContext
): Promise<User> {
  if (
    context.user!.id === user.id ||
    context.user!.role.toString() === "admin"
  ) {
    const currentUser = await getUserById(user.id, context);
    const userExists = await checkForUser(user.email, context);
    if (userExists)
      if (userExists.email !== currentUser.email)
        throw new Error(USER_EMAIL_USED_MESSAGE);
    let newPass = md5(user.password);
    const sql = !user.role
      ? `UPDATE user SET first_name = ?,
            last_name = ?,
            email = ?, 
            password = ?
            WHERE user.id = ?`
      : `UPDATE user SET first_name = ?,
            last_name = ?,
            email = ?, 
            password = ?, 
            role=? WHERE user.id = ?`;

    if (!user.role)
      context.db.run(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.id,
      ]);
    else
      context.db.run(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.role,
        user.id,
      ]);
    return getUserById(user.id,context)
  }
  throw new Error(UNAUTHORIZED_MESSAGE);
}

export async function deleteUser(
  id: string,
  context: MyContext
): Promise<User> {
  if (context.user!.id === id || context.user!.role.toString() === "admin") {
    const sqlDelete = `DELETE FROM user WHERE user.id = ?`;
    const sqlReviewDelete = `DELETE FROM review WHERE review.user_id = ?`;
    const sqlTokenDelete = `DELETE from session WHERE user_id = ?`;
    const user = getUserById(id,context)
    context.db.run(sqlReviewDelete,[id])
    context.db.run(sqlTokenDelete, [id]);
    context.db.run(sqlDelete,[id])
    return user;
  }

  throw new Error(UNAUTHORIZED_MESSAGE);
}
