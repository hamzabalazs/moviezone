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
  let token = Buffer.from(uuidv4()).toString("base64");
  const sqlSelect = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`;
  const sqlInsert = `INSERT INTO session (token,user_id) SELECT ?, id FROM user WHERE email = ? AND password = ?`;
  return new Promise((resolve, reject) => {
    if (!context.user!.token) {
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
  const isToken:CurrentUser = await new Promise((resolve, reject) => {
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
    const result:CurrentUser = await new Promise((resolve, reject) => {
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
    if(!result) throw new Error(NO_USER_MESSAGE)
    return result
  }
  return isToken;
}
