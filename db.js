import mysql from 'mysql2/promise';

const pool =  mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'dht_web'
})
export default pool;