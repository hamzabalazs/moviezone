import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../server";
import { logIn } from "./auth";
import { CurrentUser, Role, Session, User } from "./types";

export async function createToken(loginDetails:{email:string,password:string}, context:MyContext):Promise<CurrentUser> {
  const user = await logIn(loginDetails, context);
  const isToken = await getToken(user, context);
  if (isToken === undefined) {
    const token:string = Buffer.from(uuidv4()).toString("base64");
    const currentUser:CurrentUser = {
      ...user,
      token: token,
    };
    const sql = `INSERT INTO session (token,user_id)
      VALUES (?,?)`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, [token, user.id], (err:any) => {
        if (err) {
          reject(err);
        }
        resolve(currentUser);
      });
    });
  } else {
    const token:string = isToken.token;
    const currentUser:CurrentUser = {
      ...user,
      token: token,
    };
    return currentUser;
  }
}

export function getToken(user:User, context:MyContext):Promise<Session> {
  const user_id:string = user.id;
  const sql = `SELECT * FROM session where user_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, [user_id], (err: any, row: Session) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
}

export function determineRole(context:MyContext):Promise<Role> | undefined {
  const tokenString = context.req.headers['auth-token'] as string;
  const token = tokenString.replace(/['"]/g, "");
  if (token !== "") {
    const sql = `SELECT u.role FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`;
    return new Promise((resolve, reject) => {
      context.db.get(sql, [token], (err: any, row: Role) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }else return undefined
}
