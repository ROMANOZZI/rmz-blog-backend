const mysql = require("mysql2");
const ulid = require("ulid");
const { post } = require("./posts");

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

/**
 * The function `getMyposts` retrieves posts written by a user with a specific email address.
 * @param email - The email parameter is used to filter the posts based on the email of the user who
 * wrote them.
 * @returns The function `getMyposts` is returning the result of the SQL query executed using the
 * `pool.query` method. The result is an array of posts that match the specified email address.
 */
const getMyposts = async (email, limit = 25, offset = 0) => {
  try {
    const res = await pool.query(`
  select posts.post_id,title,content,createdAt,users.email from posts inner join write_post on posts.post_id=write_post.post_id inner Join users on write_post.email =users.email where users.email="${email}" Limit ${limit} offset ${offset}
`);
    const res2 = await pool.query(`
select count(post_id) from write_post where email="${email}"
`);
    return { data: res[0], count: res2[0][0]["count(post_id)"] };
  } catch (err) {
    console.log(err);
  }
};
const getPosts = async (email, limit = 25, offset = 0) => {
  const res = await pool.query(
    `select posts.post_id,title,content,createdAt ,vote from posts inner join write_post on posts.post_id = write_post.post_id inner join users on users.email=write_post.email where users.email <> "${email}" order by vote desc,createdAt desc limit ${limit} offset ${offset} ;`
  );
  const res2 = await pool.query(`
  select count(post_id) from write_post where email !="${email}"
  `);
  return { data: res[0], count: res2[0][0]["count(post_id)"] };
};

/**
 * The `addPost` function is an asynchronous function that inserts a new post into the database with
 * the provided title, content, email, and an optional vote count.
 * @param title - The title of the post.
 * @param content - The `content` parameter represents the content or body of the post that you want to
 * add. It can be a string containing the text or any other data that you want to include in the post.
 * @param email - The `email` parameter is the email of the user who is writing the post. It is used to
 * associate the post with the user in the `write_post` table.
 * @param [vote=0] - The `vote` parameter is an optional parameter that represents the initial vote
 * count for the post. If no value is provided for `vote`, it will default to 0.
 */
const addPost = async (title, content, email, vote = 0) => {
  const id = ulid.ulid();
  const query1 = `INSERT INTO posts (post_id,createdAt,title, content,vote) VALUES (?,?, ?, ?,?)`;
  const query2 = `INSERT INTO write_post (post_id, email) VALUES (?, ?)`;

  const result1 = await pool.query(query1, [
    id,
    new Date().toISOString().slice(0, 19).replace("T", " "),
    title,
    content,
    vote,
  ]);
  const result2 = await pool.query(query2, [id, email]);
};
/**
 * The `addComment` function inserts a new comment into a database table with the provided comment,
 * email, and post_id.
 * @param comment - The `comment` parameter is an object that contains information about the comment.
 * It has two properties:
 * @param email - The `email` parameter is the email address of the user who is adding the comment.
 * @param post_id - The `post_id` parameter is the identifier of the post to which the comment belongs.
 * It is used to associate the comment with the correct post in the database.
 */
const addComment = async (comment, email, post_id) => {
  const id = ulid.ulid();
  const query = `insert into comments (comment_id,email,createdAt,type,content,post_id) values(?,?,?,?,?,?)`;
  res = pool.query(query, [
    id,
    email,
    new Date().toISOString().slice(0, 19).replace("T", " "),
    comment.type,
    comment.content,
    post_id,
  ]);
};
/**
 * The function `getComments` retrieves comments of a specific post from a database.
 * @param post_id - The `post_id` parameter is the identifier of a post. It is used to retrieve the
 * comments associated with a specific post.
 * @returns The function `getComments` is returning an array of comments. Each comment object in the
 * array has properties `comment_id`, `type`, and `content`.
 */
const getComments = async (post_id) => {
  const query = `select comment_id,type,content from comments where post_id= ?`;
  const res = await pool.query(query, [post_id]);
  return res[0];
};
/**
 * The function `upVote` updates the vote count of a post in a database by incrementing it by 1.
 * @param post_id - The `post_id` parameter is the identifier of the post that you want to upvote. It
 * is used in the SQL query to update the vote count of the specified post.
 */
const upVote = async (post_id) => {
  try {
    const query = `update posts set vote=vote+1 where post_id = ?`;
    const res = await pool.query(query, [post_id]);
  } catch (Err) {
    console.log(Err);
  }
};
/**
 * The `downVote` function decreases the vote count of a post and inserts a record of the downvote in
 * the database.
 * @param post_id - The post_id parameter is the unique identifier of the post that the user wants to
 * downvote.
 * @param email - The email parameter is the email of the user who is downvoting the post.
 */
const downVote = async (post_id, email) => {
  try {
    const query1 = `update posts set vote=vote-1 where post_id=?`;
    const query2 = `insert into dwon_vote(email,post_id) values(?,?)`;
    const res1 = await pool.query(query1, [post_id]);
    const res2 = await pool.query(query2, [email, post_id]);
  } catch (err) {
    console.log(err);
  }
};

getPosts("Abdallahsaeid@gmail.com").then((res) => console.log(res));

module.exports = { checkUserByEmail, addUser, addToken, addToken, checkToken };
