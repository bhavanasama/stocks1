const {createConnection} = require('mysql2/promise');

const connectToDatabase = async () => {
    const connection = await createConnection({
        host:'localhost',
        user:'root',
        password:'n3u3da!',
        database:'stock_data'  //modify this to your database name
    });
    return connection;
};

module.exports = {connectToDatabase};