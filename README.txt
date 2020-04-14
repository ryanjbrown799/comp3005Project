Comp3005- Database Management Systems 
Project Look Inna Book online bookstore
Ryan Brown

REQUIRED
-nodejs
-postgres 12.1

INSTALL

In directory with server.js open powershell/terminal

npm init
npm install express socket.io body-parser pg express-session

open pgadmin4
create a database
open query tool
paste create_DDL.sql contents and query
paste functions.sql contents and query
paste sample_data.sql contents and query


In server.js at line 10

//connect to db
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DBNAME',
    password: 'PASSWORD',
    port: 5432,
});

change DBNAME to name of data base create
change PASSWORD to data base password

From powershell/terminal 
node server.js

open a browser
http://localhost:3000

NOTES

default manager account from sample_data is admin 1234
sample data also creates orders for march 2020 to be used for previous month sale history requirement
using two created users test 12345 and test1 12345

Limited to no input checking please use correct input types and lengths








