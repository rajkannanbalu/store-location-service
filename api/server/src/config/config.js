require('dotenv').config(); 


module.exports = {

  // If using onine database
  development: {
    database: 'nyrgcjgy',
    username: 'nyrgcjgy',
    password: 'DLpy30vgdjRQRMA87QseOLbskbrXRt1G',
    host: 'hansken.db.elephantsql.com',
    dialect: 'postgres'
  },

  // // uncomment if you are using local database for developement
  // development: {
  //   database: 'stores',
  //   username: 'rajkannan', //Change $${SUPERUSER}} if you have changed
  //   password: null,
  //   host: '127.0.0.1',
  //   dialect: 'postgres'
  // },
  

  test: {
    database: 'stores_test',
    username: 'rajkannan', //Change $${SUPERUSER}} if you have changed
    password: null,
    host: '127.0.0.1',
    dialect: 'postgres'
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};
