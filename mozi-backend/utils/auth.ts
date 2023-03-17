import md5 from "md5";
import { MyContext } from "../server";
import { CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";
import { NO_USER_MESSAGE } from "../common/errorMessages";

export async function logIn(
  loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  let isExpired = false;
  const tokenExpired = await getToken(context);
  if(tokenExpired){
    if (tokenExpired.expired === 0) isExpired = false;
    else isExpired = true;
  }
  if(isExpired) await deleteToken(context.user!.token,context)
  const token = Buffer.from(uuidv4()).toString("base64");
  const sqlSelect = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`;
  const sqlInsert = `INSERT INTO session (token,user_id,expiry) SELECT ?, id, datetime("now","+30 minute","localtime") FROM user WHERE email = ? AND password = ?`;
  return new Promise((resolve, reject) => {
    if (!context.user!.token) {
      context.db.run(sqlInsert, [token, email, md5(password)]);
    }
    if (isExpired) {
      context.db.run(sqlInsert, [token, email, md5(password)]);
    }

    context.db.get(
      sqlSelect,
      [email, md5(password)],
      (err: any, row: CurrentUser) => {
        if (err) {
          reject(err);
        }
        resolve(row);
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
  const isToken: CurrentUser = await new Promise((resolve, reject) => {
    context.db.get(
      sqlToken,
      [email, md5(password)],
      (err: any, row: CurrentUser) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
  if (!isToken) {
    const result: CurrentUser = await new Promise((resolve, reject) => {
      context.db.get(
        sqlNoToken,
        [email, md5(password)],
        (err: any, row: CurrentUser) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        }
      );
    });
    if (!result) throw new Error(NO_USER_MESSAGE);
    return result;
  }
  return isToken;
}

export async function getToken(context: MyContext): Promise<any> {
  const token = context.user!.token;
  const sql = `SELECT expiry < datetime("now","localtime") as expired FROM session WHERE token = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [token], (err: any, row: any) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}

export async function deleteToken(token:string,context: MyContext): Promise<any> {
  const sql = `DELETE from session WHERE token = ?`
  return new Promise((resolve,reject) => {
    context.db.run(sql, [token], (err: any, row: any) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    })
  })
}