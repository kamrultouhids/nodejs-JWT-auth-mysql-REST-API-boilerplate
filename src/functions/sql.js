import knex from 'knex';
require('dotenv').config();
export default knex({
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  },
  pool: { min: 0, max: 7 }
});