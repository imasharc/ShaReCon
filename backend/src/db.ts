const { Pool } = require('pg')
var pool = new Pool({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
})

module.exports=pool;