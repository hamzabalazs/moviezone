const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const userModule = require("./user")

async function logIn(loginDetails, context) {
  const email = loginDetails.email;
  const password = loginDetails.password;
  const user = await userModule.getUserForLogin(email,context)
  if(user === undefined) throw new Error("User does not exist!")
  if(md5(password) === user.password){
    const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`
    return new Promise((resolve,reject) => {
      context.db.get(sql,[user.id],(err,rows) => {
        if(err){
          reject(err)
        }
        resolve(rows)
      })
    })
  }
  throw new Error("Password not the same!")
}

async function createToken(loginDetails, context) {
  const user = await logIn(loginDetails,context);
  const isToken = await getToken(user, context);
  
  if(user === undefined){
    throw new Error("User does not exist")
  }
  if (isToken === undefined) {
    const token = Buffer.from(uuidv4()).toString("base64");
    const currentUser = {
      ...user,
      token: token,
    };
    const sql = `INSERT INTO session (token,user_id)
    VALUES (?,?)`;
    return new Promise((resolve, reject) => {
      context.db.run(sql,[token,user.id], err => {
        if (err) {
          reject(err);
        }
        resolve(currentUser);
      });
    });
  } else {
    const token = isToken.token;
    const currentUser = {
      ...user,
      token: token,
    };
    return currentUser;
  }
}

function getToken(user, context) {
  const user_id = user.id;
  const sql = `SELECT * FROM session where user_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[user_id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function determineRole(context){
  const token = context.req.headers['auth-token']
  if(token !== ""){
    const sql = `SELECT u.role FROM user u JOIN session s ON u.id = s.user_id WHERE s.token = ?`
    return new Promise((resolve, reject) => {
      context.db.get(sql,[token], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }
}

module.exports = { logIn, createToken, getToken,determineRole };
