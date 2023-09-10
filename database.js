const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "011145146",
    database: "blog",
  })
  .promise();
const addUser = async (name, email, password) => {
  return await pool.query(`
    insert into users (name,email,password) values("${name}","${email}","${password}");
    `);
};
const checkUserByEmail = async (email) => {
  const res = await pool.query(`select * from users where email= '${email}'`);

  return res;
};

module.exports = { checkUserByEmail, addUser };
