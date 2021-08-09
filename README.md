# Yaddasht_RestApi_Nodejs
 Rest Api for Yaddasht app

## Description
This Rest api is the backend for [Yaddasht](https://github.com/hamooo90/Yaddasht_java) and is written in Node.js. The job of this Rest api is **CRUD** operation and user authentication. all the data is received and stored in **MongoDb**.

### Features
- User registration and login
- Store hashed password in MongoDb
- Store and read user info and notes in/from MongoDb
- Send verification code via email and template

## Packages
- express
- dotenv
- nodemailer
- email-templates
- mongoose
- jsonwebtoken
- dotenv
- body-parser
- bcryptjs
- cors
