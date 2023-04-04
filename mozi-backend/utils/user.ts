import { GraphQLError } from "graphql";
import md5 from "md5";
import {
  NOT_VALID_USER,
  NO_RESET_TOKEN,
  NO_USER_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  USER_EMAIL_USED_MESSAGE,
} from "../../mozi-frontend/src/common/errorMessages";
import { userSchema } from "../common/validation";
import { MyContext } from "../server";
import { User, FullUser, CurrentUser } from "./types";
import { v4 as uuidv4 } from "uuid";
const nodemailer = require("nodemailer");

export function getUsers(input: any, context: MyContext): Promise<FullUser[]> {
  let sql = `SELECT * from user`;
  let params = [];
  let offsetString = "";
  sql = sql.concat(` LIMIT ?`);
  params.push(input.limit);
  if (input.offset !== 0) {
    offsetString = ` OFFSET ?`;
    sql = sql.concat(offsetString);
    params.push(input.offset);
  }
  return context.db.all<FullUser>(sql, params);
}

export function getNumberOfUsers(context: MyContext): Promise<number | null> {
  const sql = `SELECT COUNT(*) as totalCount FROM user`;
  return context.db.get<number>(sql);
}

export async function getUserById(
  id: string,
  context: MyContext
): Promise<User | null> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`;
  const result = await context.db.get<User>(sql, [id]);
  if (result === undefined) return null;
  return result;
}

export async function getFullUserById(
  id: string,
  context: MyContext
): Promise<FullUser | null> {
  const sql = `SELECT * FROM user WHERE id = ?`;
  const result = await context.db.get<FullUser>(sql, [id]);
  if (result === undefined) return null;
  return result;
}

export async function getUserByToken(
  context: MyContext
): Promise<CurrentUser | null> {
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role,s.token FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`;
  const result = await context.db.get<CurrentUser>(sql, [
    context.req.headers["auth-token"],
  ]);
  if (result === undefined) return null;
  return result;
}

export async function getUserForPassChange(token:string,context:MyContext): Promise<FullUser | null>{
  const sql = `SELECT u.id,u.first_name,u.last_name,u.email,u.password,u.role FROM user u JOIN reset_password rs ON u.id = rs.user_id WHERE rs.token = ?`
  return await context.db.get(sql,[token])
}

export async function checkForUser(
  email: string,
  context: MyContext
): Promise<User | null> {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = ?`;
  const result = await context.db.get<User>(sql, [email]);
  if (result === undefined) return null;
  return result;
}

export async function createUser(
  user: FullUser,
  context: MyContext
): Promise<User | null> {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  context.db.run(sql, [
    user.id,
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.role,
  ]);
  return getUserById(user.id, context);
}

export async function updateUser(
  user: FullUser,
  context: MyContext
): Promise<User | null> {
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
    if (userExists !== null && currentUser !== null)
      if (userExists.email !== currentUser.email)
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
      context.db.run(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.id,
      ]);
    else
      context.db.run(sql, [
        user.first_name,
        user.last_name,
        user.email,
        newPass,
        user.role,
        user.id,
      ]);
    return getFullUserById(user.id, context);
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
    context.db.run(sqlReviewDelete, [id]);
    context.db.run(sqlTokenDelete, [id]);
    context.db.run(sqlDelete, [id]);
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
  return context.db.run(sql, [md5(input.password),input.user_id]);
}

export async function getResetToken(email:string,context:MyContext): Promise<string | null> {
  const user = await checkForUser(email, context);
  if (!user)
    throw new GraphQLError(NO_USER_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const sqlGetToken = "SELECT token FROM reset_password WHERE user_id = ?";
  const result = await context.db.get<any>(sqlGetToken,[user.id])
  return result.token;
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
  const sqlInsert = `INSERT INTO reset_password (user_id,token,expiry) VALUES (?,?,datetime("now","+1 hour","localtime"))`;
  const sqlExpired =
    'SELECT expiry < datetime("now","localtime") as expired FROM reset_password WHERE user_id = ?';
  const sqlDelete = "DELETE FROM reset_password WHERE user_id = ?";
  
  const isExpired = await context.db.get<any>(sqlExpired, [user.id]);
  const token = Buffer.from(uuidv4()).toString("base64");
  if (isExpired === undefined){
    await context.db.run(sqlInsert, [user.id, token]);
  }
  else if (isExpired.expired === 1) {
    await context.db.run(sqlDelete, [user.id]);
    await context.db.run(sqlInsert, [user.id, token]);
  }
    const resetToken = await getResetToken(email,context);
  if (!resetToken)
    throw new GraphQLError(NO_RESET_TOKEN, {
      extensions: { code: "NOT_FOUND" },
    });

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
    text: `Dear ${user.first_name} \n\n You have sent a request to reset your password. By clicking on the link provided, you will be able to give a new password to your account. You have one hour to reset your password! If you did not ask to reset your password, ignore this message \n Link:http://localhost:3000/resetpassword/${resetToken}`,
  });
  console.log(info)
  if(!info) return false;
  return true;
}


