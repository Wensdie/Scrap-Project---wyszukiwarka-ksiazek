import pg from 'pg';

const { Client } = pg;
const connection = new Client({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: '5432',
    database: 'scrap-project',
});

export default connection;