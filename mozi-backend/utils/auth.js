const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const userModule = require("./user")

async function logIn(loginDetails, context) {
  const email = loginDetails.email;
  const password = loginDetails.password;
  const user = await userModule.getUserForLogin(email,context)
  if(user === undefined) throw new Error("User does not exist!")
  if(md5(password) === user.password){
    const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = "${user.id}"`
    return new Promise((resolve,reject) => {
      context.db.get(sql,(err,rows) => {
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
    VALUES ("${token}","${user.id}")`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
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
  const sql = `SELECT * FROM session where user_id = "${user_id}"`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = { logIn, createToken, getToken };
