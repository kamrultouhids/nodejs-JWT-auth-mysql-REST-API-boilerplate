## Nodejs RESTful API Boilerplate with JSONWebToken | Express Js

### How to use

- Clone the repository with __git clone__
- Run __npm install__
- Run __cp .env.example .env__ for create .env file
- Import __db.sql__ database
- Edit database credentials __.env__ file 
- Run __npm run dev__ for start server

### Serve run http://localhost:8080

## API Endpoints

#### Welcome
- **<code>GET</code> api/welcome**

#### Authentication
- **<code>POST</code> api/login**

#### Registration
- **<code>POST</code> api/register**
- **<code>POST</code> api/account-verification**
- **<code>POST</code> api/account-verification-resend**

#### Password Reset
- **<code>POST</code> api/password/forgot**
- **<code>POST</code> api/password/forgot-code-match**
- **<code>POST</code> api/password/reset**

#### User
- **<code>GET</code> api/users**
- **<code>PUT</code> api/users/:id/toggle-status**

## API Status Code

Following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `Success` |
| 401 | `Invalid Credentials` |
| 404 | `Error` |
| 500 | `INTERNAL SERVER ERROR` |
