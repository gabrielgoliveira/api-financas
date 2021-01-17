const knex = require('knex')({
    client: 'pg',
    version: '13.1',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '123456',
      database : 'financas-teste'
    }
  });

  module.exports = knex;