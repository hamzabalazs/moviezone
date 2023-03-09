const md5 = require("md5");
import { MyContext } from "../server";
import { determineRole, getToken, createToken } from "./token";
import { User, FullUser, DbUser } from "./types";

export function getCurrentUser(context:MyContext): Promise<User> {
  const token = context.req.headers['auth-token'];
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

export function getUsers(__:any, context:MyContext): Promise<User[]> {
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

export function getUserById(id:string, context:MyContext): Promise<User> {
  console.log(id)
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

export function checkForUser(email:string, context:MyContext): Promise<User> {
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

export async function createUser(user:FullUser, context:MyContext): Promise<DbUser> {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  const role = user.role.toString()
  const returnUser:DbUser = {
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
      (err:any) => {
        if (err) {
          reject(err);
        }
        resolve(returnUser);
      }
    );
  });
}

export async function updateUser(user: FullUser, context:MyContext): Promise<User> {
  const token = await getToken(user, context);
  if (!token) throw new Error("No Token/User has not logged in yet ( no token created )");
  const role = await determineRole(context);
  if (role === undefined) throw new Error("Role not found");
  if (
    token.token === context.req.headers['auth-token'] ||
    role.role === "admin"
  ) {
    const currentUser = await getUserById(user.id, context);
    let newPass = md5(user.password);
    //How to make it safe?
    const sql = !user.role
      ? `UPDATE user SET first_name = "${user.first_name}",
          last_name = "${user.last_name}",
          email = "${user.email}", 
          password = "${newPass}"
          WHERE user.id = "${user.id}"`
      : `UPDATE user SET first_name = "${user.first_name}",
          last_name = "${user.last_name}",
          email = "${user.email}", 
          password = "${newPass}", 
          role="${user.role}" WHERE user.id = "${user.id}"`;

    if (!user.role) {
      const returnUser: User = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: currentUser.role,
      };
      return new Promise((resolve, reject) => {
        context.db.run(sql, (err: any) => {
          if (err) {
            reject(err);
          }
          resolve(returnUser);
        });
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
        context.db.run(sql, (err: any) => {
          if (err) {
            reject(err);
          }
          resolve(returnUser);
        });
      });
    }
  }
  throw new Error("Unauthorized!");
}

export async function deleteUser(id: string, context:MyContext): Promise<User> {
  const user = await getUserById(id, context);
  const token = await getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await determineRole(context);
  if (role === undefined) throw new Error("Role not found");
  if (
    token.token === context.req.headers['auth-token'] ||
    role.role === "admin"
  ) {
    const sql = `DELETE FROM user WHERE user.id = "${id}"`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err:any) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
  }
  throw new Error("Unauthorized!");
}
