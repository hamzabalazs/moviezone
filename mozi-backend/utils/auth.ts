import md5 from 'md5'
import { MyContext } from '../server';
import { User, FullUser } from './types';

export async function logIn(loginDetails:{email:string,password:string}, context:MyContext):Promise<User> {
  const email:string = loginDetails.email;
  const password:string = loginDetails.password;
  console.log(password)
  const user:FullUser = await getUserForLogin(email,context)
  console.log(user)
  if(user === undefined) throw new Error("User does not exist!")
  if(md5(password) === user.password){
    const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`
    return new Promise((resolve,reject) => {
      context.db.get(sql,[user.id],(err: any,rows: User) => {
        if(err){
          reject(err)
        }
        resolve(rows)
      })
    })
  }
  throw new Error("Password not the same!")
}

export function getUserForLogin(email:string, context:MyContext):Promise<FullUser> {
  const sql = `SELECT * FROM user WHERE user.email = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[email], (err: any, rows: FullUser) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
