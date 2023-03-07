const md5 = require("md5");

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
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.id = "${id}"`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function checkForUser(email, context) {
  const sql = `SELECT id,first_name,last_name,email,role FROM user WHERE user.email = "${email}"`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function getUserForLogin(email,context){
  const sql = `SELECT * FROM user WHERE user.email = "${email}"`;
  return new Promise((resolve, reject) => {
    context.db.get(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

async function createUser(user, context) {
  const sql = `INSERT INTO user (id,first_name,last_name,email,password,role) VALUES ("${user.id}","${user.first_name}","${user.last_name}","${user.email}","${user.password}","${user.role}")`;
  const returnUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
  }
  return new Promise((resolve, reject) => {
    context.db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(returnUser);
    });
  });
}

async function updateUser(user, context) {
  const currentUser = await getUserById(user.id,context)
  let newPass = md5(user.password)
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

  if(!user.role){
    const returnUser = {
      id:user.id,
      first_name:user.first_name,
      last_name:user.last_name,
      email:user.email,
      role:currentUser.role
    }
    return new Promise((resolve, reject) => {
      context.db.run(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(returnUser);
      });
    });
  }else{
    const returnUser = {
      id:user.id,
      first_name:user.first_name,
      last_name:user.last_name,
      email:user.email,
      role:user.role
    }
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

async function deleteUser(id, context) {
  const user = await getUserById(id,context)
  const sql = `DELETE FROM user WHERE user.id = "${id}"`;
  return new Promise((resolve, reject) => {
    context.db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
}

module.exports = { createUser, deleteUser, updateUser, getUsers, checkForUser, getUserById, getUserForLogin };
