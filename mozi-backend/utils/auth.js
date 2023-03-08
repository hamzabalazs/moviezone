const md5 = require("md5");

async function logIn(loginDetails, context) {
  const email = loginDetails.email;
  const password = loginDetails.password;
  const user = await getUserForLogin(email,context)
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

function getUserForLogin(email, context) {
  const sql = `SELECT * FROM user WHERE user.email = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[email], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = { logIn,getUserForLogin };
