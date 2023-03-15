const md5 = require("md5");
import { MyContext } from "../server";
import { User, FullUser, DbUser, CurrentUser } from "./types";

export function getCurrentUser(context: MyContext): Promise<User> {
  const token = context.req.headers["auth-token"] as string;
  // console.log(tokenString)
  // const token = tokenString.replace(/['"]/g, "");
  if (!token) throw new Error("Could not get token of current user");
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.role FROM session s JOIN user u ON s.user_id = u.id WHERE s.token = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [token], (err: any, rows: User) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getUsers(__: any, context: MyContext): Promise<User[]> {
  const sql = "SELECT id,first_name,last_name,email,role FROM user";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err: any, rows: User[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getUserById(id: string, context: MyContext): Promise<User> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [id], (err: any, rows: User) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export function getUserByToken(context: MyContext): Promise<CurrentUser> {
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(
      sql,
      [context.req.headers["auth-token"]],
      (err: any, row: CurrentUser) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
}

export function checkForUser(email: string, context: MyContext): Promise<User> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [email], (err: any, rows: User) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export async function createUser(
  user: FullUser,
  context: MyContext
): Promise<DbUser> {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  const role = user.role.toString();
  const returnUser: DbUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    role: role,
    email: user.email,
  };
  return new Promise((resolve, reject) => {
    context.db.run(
      sql,
      [
        user.id,
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.role,
      ],
      (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(returnUser);
      }
    );
  });
}

export async function updateUser(
  user: FullUser,
  context: MyContext
): Promise<User> {
  if (context.user) {
    if (
      context.user.id === user.id ||
      context.user.role.toString() === "admin"
    ) {
      const currentUser = await getUserById(user.id, context);
      const userExists = await checkForUser(user.email, context);
      if (userExists.email !== currentUser.email)
        throw new Error("Cannot change email to already existing one!");
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

      if (!user.role) {
        const returnUser: User = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: currentUser.role,
        };
        return new Promise((resolve, reject) => {
          context.db.run(
            sql,
            [user.first_name, user.last_name, user.email, newPass, user.id],
            (err: any) => {
              if (err) {
                reject(err);
              }
              resolve(returnUser);
            }
          );
        });
      } else {
        const returnUser = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        };
        return new Promise((resolve, reject) => {
          context.db.run(
            sql,
            [
              user.first_name,
              user.last_name,
              user.email,
              newPass,
              user.role,
              user.id,
            ],
            (err: any) => {
              if (err) {
                reject(err);
              }
              resolve(returnUser);
            }
          );
        });
      }
    }
  }

  throw new Error("Unauthorized!");
}

export async function deleteUser(
  id: string,
  context: MyContext
): Promise<User> {
  if (context.user) {
    const user = await getUserById(id, context);
    if (
      context.user.id === id ||
      context.user.role.toString() === "admin"
    ) {
      const sqlDelete = `DELETE FROM user WHERE user.id = ?`;
      const sqlReviewDelete = `DELETE FROM review WHERE review.user_id = ?`
      return new Promise((resolve, reject) => {
        context.db.run(sqlReviewDelete,[id]);
        context.db.run(sqlDelete,[id], (err: any) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
      
    }
  }

  throw new Error("Unauthorized!");
}
