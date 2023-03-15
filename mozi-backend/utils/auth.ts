import md5 from "md5";
import { MyContext } from "../server";
import { CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";

export async function logIn(
  loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  let token = Buffer.from(uuidv4()).toString("base64");
  const sqlSelect = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`
  const sqlInsert = `INSERT INTO session (token,user_id) SELECT ?, id FROM user WHERE email = ? AND password = ?`
  if(context.user){
  }
  return new Promise((resolve, reject) => {
    if(!context.user){
      context.db.run(sqlInsert, [token,email,md5(password)]);
    }
    context.db.get(sqlSelect, [email,md5(password)], (err: any, row: CurrentUser) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    })
  });
}

export async function getUserForLogin(loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`
  return new Promise((resolve, reject) => {
    context.db.get(sql, [email,md5(password)], (err: any, row: CurrentUser) => {
      if (err) {
        reject(err);
      }
      console.log(row)
      resolve(row);
    })
  });
}
