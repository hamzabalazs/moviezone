const md5 = require("md5");
const tokenModule = require("./auth");

function getUsers(__, context) {
  const sql = "SELECT id,first_name,last_name,email,role FROM user";
  return new Promise((resolve, reject) => {
    context.db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getUserById(id, context) {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function checkForUser(email, context) {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = ?`;
  return new Promise((resolve, reject) => {
    context.db.get(sql,[email], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}



async function createUser(user, context) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES (?,?,?,?,?,?)`;
  const returnUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };
  return new Promise((resolve, reject) => {
    context.db.run(sql,[user.id,user.first_name,user.last_name,user.email,user.password,user.role], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(returnUser);
    });
  });
}

async function updateUser(user, context) {
  const token = await tokenModule.getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await tokenModule.determineRole(context);
  if (
    token.token === context.req.headers["auth-token"] ||
    role.role === "admin"
  ) {
    const currentUser = await getUserById(user.id, context);
    let newPass = md5(user.password);
    //How to make it safe?
    const sql = !user.role
      ? `UPDATE user SET first_name = "${user.first_name}",
          last_name = "${user.last_name}",
          email = "${user.email}", 
          password = "${newPass}"
          WHERE user.id = "${user.id}"`
      : `UPDATE user SET first_name = "${user.first_name}",
          last_name = "${user.last_name}",
          email = "${user.email}", 
          password = "${newPass}", 
          role="${user.role}" WHERE user.id = "${user.id}"`;

    if (!user.role) {
      const returnUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: currentUser.role,
      };
      return new Promise((resolve, reject) => {
        context.db.run(sql, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(returnUser);
        });
      });
    } else {
      const returnUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      };
      return new Promise((resolve, reject) => {
        context.db.run(sql, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(returnUser);
        });
      });
    }
  }
  throw new Error("Unauthorized!");
}

async function deleteUser(id, context) {
  const token = await tokenModule.getToken(user, context);
  if (!token) throw new Error("No Token");
  const role = await tokenModule.determineRole(context);
  if (
    token.token === context.req.headers["auth-token"] ||
    role.role === "admin"
  ) {
    const user = await getUserById(id, context);
    const sql = `DELETE FROM user WHERE user.id = "${id}"`;
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
  } throw new Error("Unauthorized!")
}

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getUsers,
  checkForUser,
  getUserById,
  
};
