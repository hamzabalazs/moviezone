import { GraphQLError } from "graphql";
import md5 from "md5";
import {
  NOT_VALID_USER,
  NO_RESET_TOKEN,
  NO_USER_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  USER_EMAIL_USED_MESSAGE,
} from "../common/errorMessages";
import { userSchema } from "../common/validation";
import { MyContext } from "../server";
import { User, FullUser, CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

export function getUsers(input: any, context: MyContext): Promise<FullUser[]> {
  let sql = `SELECT * from user`;
  let params:any[] = [];
  let offsetString = "";
  sql = sql.concat(` LIMIT ?`);
  params.push(input.limit);
  if (input.offset !== 0) {
    offsetString = ` OFFSET ?`;
    sql = sql.concat(offsetString);
    params.push(input.offset);
  }
  
  return new Promise((resolve,reject) => {
    context.db.query(sql, params,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  });
}

export function getNumberOfUsers(context: MyContext): Promise<number | null> {
  const sql = `SELECT COUNT(*) as totalCount FROM user`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getUserById(
  id: string,
  context: MyContext
): Promise<User | null> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,[id],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getFullUserById(
  id: string,
  context: MyContext
): Promise<FullUser | null> {
  const sql = `SELECT * FROM user WHERE id = ?`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,[id],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getUserByToken(
  context: MyContext
): Promise<CurrentUser | null> {
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,[context.req.headers["auth-token"]],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function getUserForPassChange(token:string,context:MyContext): Promise<FullUser | null>{
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role FROM user u JOIN reset_password rs ON u.id = rs.user_id WHERE rs.token = ?`
  return new Promise((resolve,reject) => {
    context.db.query(sql,[token],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function checkForUser(
  email: string,
  context: MyContext
): Promise<User | null> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = ?`;
  return new Promise((resolve,reject) => {
    context.db.query(sql,[email],(err:any,res:any) => {
      if(err){
        reject(err)
      }
      resolve(res[0])
    })
  });
}

export async function createUser(
  user: FullUser,
  context: MyContext
): Promise<User | null> {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  const result = context.db.query(sql, [
    user.id,
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.role,
  ]);
  return{
    id:user.id,
    first_name:user.first_name,
    last_name:user.last_name,
    email:user.email,
    role:user.role
  }
}

export async function updateUser(
  user: FullUser,
  context: MyContext
): Promise<FullUser | null> {
  if (
    context.user!.id === user.id ||
    context.user!.role.toString() === "admin"
  ) {
    const validation = await userSchema.isValid(user);
    if (!validation)
      throw new GraphQLError(NOT_VALID_USER, {
        extensions: { code: "VALIDATION_FAILED" },
      });
    const currentUser = await getUserById(user.id, context);
    const userExists = await checkForUser(user.email, context);
    if (userExists !== undefined && currentUser !== undefined)
      if (userExists!.email !== currentUser!.email)
        throw new GraphQLError(USER_EMAIL_USED_MESSAGE, {
          extensions: { code: "BAD_USER_INPUT" },
        });

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

    if (!user.role)
      context.db.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.id,
      ]);
    else
      context.db.query(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.role,
        user.id,
      ]);
    const result = await getFullUserById(user.id, context);
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email:user.email,
      password: user.password,
      role: user?.role ? user!.role : result!.role,
    }
  }
  throw new GraphQLError(UNAUTHORIZED_MESSAGE, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

export async function deleteUser(
  id: string,
  context: MyContext
): Promise<User | null> {
  if (context.user!.id === id || context.user!.role.toString() === "admin") {
    const sqlDelete = `DELETE FROM user WHERE user.id = ?`;
    const sqlReviewDelete = `DELETE FROM review WHERE review.user_id = ?`;
    const sqlTokenDelete = `DELETE from session WHERE user_id = ?`;
    const user = await getFullUserById(id, context);
    context.db.query(sqlReviewDelete, [id]);
    context.db.query(sqlTokenDelete, [id]);
    context.db.query(sqlDelete, [id]);
    return user;
  }

  throw new GraphQLError(UNAUTHORIZED_MESSAGE, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

export async function changePassword(
  input:{
    user_id:string,
    password:string
  },
  context: MyContext
): Promise<any> {
  const sql = `UPDATE user SET password = ? WHERE id = ?`;
  // return context.db.query(sql, [md5(input.password),input.user_id]);
  return new Promise((resolve, reject) => {
    context.db.query(sql, [md5(input.password),input.user_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res[0]);
    });
  });
}

export async function getResetToken(email:string,context:MyContext): Promise<string | null> {
  const user = await checkForUser(email, context);
  if (!user)
    throw new GraphQLError(NO_USER_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const sqlGetToken = "SELECT rp.token FROM reset_password rp JOIN user u ON rp.user_id = u.id WHERE u.email = ?";
  context.db.query(sqlGetToken,[user.id])
  return new Promise((resolve, reject) => {
    context.db.query(sqlGetToken, [email], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      resolve(res[0].token);
    });
  });
}

export async function sendForgotPassEmail(
  email: string,
  context: MyContext
): Promise<any> {
  const user = await checkForUser(email, context);
  if (!user)
    throw new GraphQLError(NO_USER_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const sqlInsert = `INSERT INTO reset_password (id,user_id,token,expiry) VALUES (?,?,?,DATE_ADD(now(), INTERVAL 1 HOUR))`;
  const sqlExpired =
    'SELECT expiry < now() as expired FROM reset_password WHERE user_id = ?';
  const sqlDelete = "DELETE FROM reset_password WHERE user_id = ?";
  
  const isExpired = context.db.query(sqlExpired, [user.id]);
  const token = Buffer.from(uuidv4()).toString("base64");
  if (isExpired[0] === undefined){
    context.db.query(sqlInsert, [uuidv4(),user.id, token]);
  }
  else if (isExpired.expired === 1) {
    context.db.query(sqlDelete, [user.id]);
    context.db.query(sqlInsert, [user.id, token]);
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "hulda.conroy@ethereal.email",
      pass: "nQxcVfDrHPkAK5kUYJ",
    },
  });

  const info = await transporter.sendMail({
    from: '"Movie Zone" <moviezone@ethereal.email>',
    to: email,
    subject: "Reset password",
    text: `Dear ${user.first_name} \n\n You have sent a request to reset your password. By clicking on the link provided, you will be able to give a new password to your account. You have one hour to reset your password! If you did not ask to reset your password, ignore this message \n Link:http://localhost:3000/resetpassword/${token}`,
  });
  if(!info) return false
  return true
}


