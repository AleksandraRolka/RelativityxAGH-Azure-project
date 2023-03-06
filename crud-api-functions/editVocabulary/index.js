const pg = require('pg'); 
const config = require('./../config');

// Entry point of the function
module.exports = async function(context, req) {

    // Create query to execute against the database
    var id = context.bindingData.id;
    const querySpec = {
        text: `UPDATE vocabulary SET english_version='${req.body.english}', polish_version='${req.body.polish}' WHERE id=${id}`
    }

    try {
        // Create a pool of connections
        // const pool = new pg.Pool({"host=c.term-project-db.postgres.database.azure.com port=5432 dbname=citus user=citus password=pass123! sslmode=require"});
        const pool = new pg.Pool(config.DB_CONN_CONFIG);

        // Get a new client connection from the pool
        const client = await pool.connect();

        // Execute the query against the client
        const result = await client.query(querySpec);

        // Release the connection
        client.release();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 200,
            isRaw: true,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        let messageResp = err.message;
        
        if ((err.message).includes("eng_string_len")) {
            messageResp = "English text must be between 2 and 300 characters long.";
        }
        if ((err.message).includes("pol_string_len")) {
            messageResp = "Polish text must be between 2 and 300 characters long.";
        }
        if ((err.message).includes("duplicate key")) {
            messageResp = "Vocabulary already exists. Choose different vocabulary or update existing one.";
        }
        
        context.res = {
            status: 400,
            isRaw: true,
            body: {
                "message": messageResp
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}