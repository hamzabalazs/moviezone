const { v4: uuidv4 } = require("uuid");
const authModule = require("./auth")

async function createToken(loginDetails, context) {
    const user = await authModule.logIn(loginDetails,context);
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
    const tokenString = context.req.headers['auth-token']
    const token = tokenString.replace(/['"]/g, '')
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

  module.exports = {determineRole,getToken,createToken}