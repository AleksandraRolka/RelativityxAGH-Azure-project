const pg = require('pg'); 
const config = require('./../config');

// Entry point of the function
module.exports = async function(context, req) {

    // Create query to execute against the database
    const querySpec = {
        text: `INSERT INTO vocabulary (english_version, polish_version) VALUES('${req.body.english}', '${req.body.polish}');`
    }

    try {
        // Create a pool of connections
        const pool = new pg.Pool(config.DB_CONN_CONFIG);

        // Get a new client connection from the pool
        const client = await pool.connect();

        // Execute the query against the client
        const result = await client.query(querySpec);

        // Release the connection
        client.release();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 201,
            isRaw: true,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(err.message);
        let messageResp = err.message;
        
        if ((err.message).includes("eng_string_len")) {
            messageResp = "English text must be between 2 and 300 characters long.";
        }
        if ((err.message).includes("pol_string_len")) {
            messageResp = "Polish text must be between 2 and 300 characters long.";
        }
        if ((err.message).includes("duplicate key")) {
            messageResp = "Vocabulary already exists. Cannot create new one with same text, but you can update existing one.";
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