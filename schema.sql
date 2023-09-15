Create TABLE users (
    id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
);

create table upvote(
email varchar(255),
post_id varchar(255) ,
foreign key(email) references users(email),
foreign key(post_id) references posts(post_id)
)
create table comments(
comment_id varchar(255) primary key ,
email varchar(255),
type varchar(255),
createdAt time,
content text ,
post_id varchar(255) ,
foreign key(email) references users(email),
foreign key(post_id) references posts(post_id)
)
create table posts(
post_id varchar(255) primary key ,
createdAt time,
title varchar(255),
content text,
vote int)
;
CREATE TABLE write_post(
  email VARCHAR(255) ,
  post_id varchar(255) ,
    foreign key(email) references users(email),
    foreign key(post_id) references posts(post_id)
);
select posts.post_id,title,content,createdAt ,vote from posts inner join write_post on posts.post_id = write_post.post_id inner join users on users.email=write_post.email where users.email <> "alice.johnson@example.com" order by vote desc,createdAt desc;
select posts.post_id,content,createdAt,users.email from posts inner join write_post on posts.post_id=write_post.post_id inner Join users on write_post.email =users.email where users.email="alice.johnson@example.com"
