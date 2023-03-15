import { MyContext } from "../server";
import { Session, User } from "./types";

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

