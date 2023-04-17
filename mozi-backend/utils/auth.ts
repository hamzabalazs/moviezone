import md5 from "md5";
import { MyContext } from "../server";
import { CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";
import { NO_USER_MESSAGE } from "../common/errorMessages";
import { GraphQLError } from "graphql";

export async function logIn(
  loginDetails: { email: string; password: string },
  context: MyContext
): Promise<CurrentUser|null> {
  const email: string = loginDetails.email;
  const password: string = loginDetails.password;
  let isExpired = false;
  const tokenExpired = await getToken(context);
  if(tokenExpired){
    if (tokenExpired.expired === 0) isExpired = false;
    else isExpired = true;
  }
  if(isExpired) deleteToken(context.user!.token,context)
  const token = Buffer.from(uuidv4()).toString("base64");
  const sqlSelect = `SELECT u.id,u.first_name,u.last_name,u.email,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE u.email = ? AND u.password = ?`;
  const sqlInsert = `INSERT INTO session (token,user_id,expiry) SELECT ?, id, DATE_ADD(now(), INTERVAL 1 HOUR) FROM user WHERE email = ? AND password = ?`;
  if(!context.user!.token) context.db.query(sqlInsert,[token,email,md5(password)]);
  if(isExpired) context.db.query(sqlInsert,[token,email,md5(password)])
  return new Promise((resolve,reject) => {
    context.db.query(sqlSelect,[email,md5(password)],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      console.log("res",res)
      resolve(res[0])
    })
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
  const isToken:CurrentUser|null = await new Promise((resolve,reject) => {
    context.db.query(sqlToken,[email,md5(password)],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  })
  if (!isToken) {
    const result: CurrentUser|null = context.db.query(sqlNoToken,[email,md5(password)])
    if (!result) throw new GraphQLError(NO_USER_MESSAGE,{extensions:{code:'NOT_FOUND'}})
    return new Promise((resolve,reject) => {
      context.db.query(sqlNoToken,[email,md5(password)],(err:any,res:any) => {
        if(err){
          reject(err)
        }
        resolve(res[0])
      })
    });
  }
  return new Promise((resolve,reject) => {
    context.db.query(sqlToken,[email,md5(password)],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getToken(context: MyContext): Promise<any> {
  const token = context.user!.token;
  const sql = `SELECT expiry < now() as expired FROM session WHERE token = ?`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,[token],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      console.log("expiry",res)
      resolve(res[0])
    })
  });
}

export async function deleteToken(token:string,context: MyContext): Promise<any> {
  const sql = `DELETE from session WHERE token = ?`
  return new Promise((resolve,reject) => {
    context.db.query(sql,[token],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}
