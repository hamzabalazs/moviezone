import md5 from "md5";
import { MyContext } from "../server";
import { CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";
import { NO_USER_MESSAGE } from "../common/errorMessages";
import { GraphQLError } from "graphql";

export async function logIn(
  loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser | null> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  let isExpired = false;
  const tokenExpired = await getToken(context);
  if (tokenExpired) {
    if (tokenExpired.expired === 0) isExpired = false;
    else isExpired = true;
  }
  if (isExpired) await deleteToken(context.user!.token, context);
  const token = Buffer.from(uuidv4()).toString("base64");
  const sqlSelect = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`;
  const sqlInsert = `INSERT INTO session (token,user_id,expiry) SELECT ?, id, DATE_ADD(now(), INTERVAL 1 HOUR) FROM user WHERE email = ? AND password = ?`;
  const sqlInsertTest = `INSERT INTO session (token,user_id,expiry) SELECT ?, id, datetime("now","+1 hour") FROM user WHERE email = ? AND password = ?`;
  if (!context.user!.token) {
    if (context.db.filename === ":memory:") {
      context.db.run(sqlInsertTest, [token, email, md5(password)]);
    } else context.db.query(sqlInsert, [token, email, md5(password)]);
  }
  if (isExpired) {
    if (context.db.filename === ":memory:") {
      context.db.run(sqlInsertTest, [token, email, md5(password)]);
    } else context.db.query(sqlInsert, [token, email, md5(password)]);
  }
  if (context.db.filename === ":memory:") {
    return context.db.get(sqlSelect, [email, md5(password)]);
  } else
    return new Promise((resolve, reject) => {
      context.db.query(
        sqlSelect,
        [email, md5(password)],
        (err: any, res: any) => {
          if (err) {
            reject(err);
          }
          if (res) resolve(res[0]);
        }
      );
    });
}

export async function getUserForLogin(
  loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  const sqlToken = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`;
  const sqlNoToken = `SELECT id,first_name,last_name,email,role FROM user WHERE email = ? AND password = ?`;
  let isToken: CurrentUser | null;
  if (context.db.filename === ":memory:") {
    isToken = await context.db.get(sqlToken, [email, md5(password)]);
  } else {
    isToken = await new Promise((resolve, reject) => {
      context.db.query(
        sqlToken,
        [email, md5(password)],
        (err: any, res: any) => {
          if (err) {
            reject(err);
          }
          if (res) resolve(res[0]);
        }
      );
    });
  }
  if (!isToken) {
    console.log("eleje")
    if (context.db.filename === ":memory:") {
      const result = await context.db.get(sqlNoToken, [email, md5(password)]);
      if (!result)
        throw new GraphQLError(NO_USER_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
    } else {
      const result: CurrentUser | null = context.db.query(sqlNoToken, [
        email,
        md5(password),
      ]);
      if (!result)
        throw new GraphQLError(NO_USER_MESSAGE, {
          extensions: { code: "NOT_FOUND" },
        });
    }
    if (context.db.filename === ":memory:") {
      return context.db.get(sqlNoToken, [email, md5(password)]);
    } else
      return new Promise((resolve, reject) => {
        context.db.query(
          sqlNoToken,
          [email, md5(password)],
          (err: any, res: any) => {
            if (err) {
              reject(err);
            }
            if (res) resolve(res[0]);
          }
        );
      });
  }
  if (context.db.filename === ":memory:") {
    return context.db.get(sqlToken, [email, md5(password)]);
  } else
    return new Promise((resolve, reject) => {
      context.db.query(
        sqlToken,
        [email, md5(password)],
        (err: any, res: any) => {
          if (err) {
            reject(err);
          }
          if (res) resolve(res[0]);
        }
      );
    });
}

export async function getToken(context: MyContext): Promise<any> {
  if (context.user === undefined)
    throw new GraphQLError(NO_USER_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const token = context.user!.token;
  if (context.db.filename === ":memory:") {
    const sql = `SELECT expiry < datetime("now") as expired FROM session WHERE token = ?`;
    return context.db.get(sql, [token]);
  } else {
    const sql = `SELECT expiry < now() as expired FROM session WHERE token = ?`;
    return new Promise((resolve, reject) => {
      context.db.query(sql, [token], (err: any, res: any) => {
        if (err) {
          reject(err);
        }
        if (res) resolve(res[0]);
      });
    });
  }
}

export async function deleteToken(
  token: string,
  context: MyContext
): Promise<any> {
  const sql = `DELETE from session WHERE token = ?`;
  if (context.db.filename === ":memory:") {
    context.db.run(sql, [token]);
  } else
    return new Promise((resolve, reject) => {
      context.db.query(sql, [token], (err: any, res: any) => {
        if (err) {
          reject(err);
        }
        if (res) resolve(res[0]);
      });
    });
}
