const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "011145146",
    database: "blog",
  })
  .promise();
/**
 * The function `addUser` is an asynchronous function that inserts a new user into a database table
 * with the provided name, email, and password.
 * @param name - The name parameter is the name of the user that you want to add to the database.
 * @param email - The `email` parameter is a string that represents the email address of the user you
 * want to add to the database.
 * @param password - The `password` parameter is the password that the user wants to set for their
 * account.
 * @returns The `addUser` function is returning the result of the `pool.query` function, which is a
 * promise.
 */
const addUser = async (name, email, password) => {
  return await pool.query(`
    insert into users (name,email,password) values("${name}","${email}","${password}");
    `);
};
/**
 * The function `checkUserByEmail` queries the database to check if a user with the given email exists.
 * @param email - The email parameter is a string that represents the email address of a user.
 * @returns The function `checkUserByEmail` is returning the result of the query executed using the
 * `pool` object.
 */
const checkUserByEmail = async (email) => {
  const res = await pool.query(`select * from users where email= '${email}'`);

  return res;
};
/**
 * The addToken function inserts a refresh token and email into a database table called refresh_tokens.
 * @param Token - The `Token` parameter is a string representing the refresh token that needs to be
 * added to the database.
 * @param email - The email parameter is a string that represents the email address of the user for
 * whom the token is being added.
 * @returns The `addToken` function is returning the result of the `pool.query` function, which is a
 * promise.
 */
const addToken = async (Token, email) => {
  return await pool.query(
    `
    insert into refresh_tokens (email,token) values ("${email}","${Token}")
    `
  );
};
/**
 * The function `checkToken` checks if a given token exists in the `refresh_tokens` table.
 * @param Token - The `Token` parameter is a string that represents a refresh token. It is used to
 * query the database and check if the token exists in the `refresh_tokens` table.
 * @returns The function `checkToken` is returning a boolean value. It will return `true` if there is
 * at least one row in the `refresh_tokens` table that has a matching token value, and `false`
 * otherwise.
 */
const checkToken = async (Token) => {
  const res = await pool.query(`
  select * from refresh_tokens where token= "${Token}"
  `);
  return res[0].length > 0;
};

module.exports = { checkUserByEmail, addUser, addToken, addToken, checkToken };
