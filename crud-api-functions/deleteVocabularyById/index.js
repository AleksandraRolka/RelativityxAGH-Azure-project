const pg = require('pg'); 
const config = require('./../config');

// Entry point of the function
module.exports = async function(context, req) {

    // Create query to execute against the database
    var id = context.bindingData.id;
    const querySpec = {
        text: `DELETE FROM vocabulary WHERE id=${id}`
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
        if (result.rowCount == 0) {
            context.res = {
            status: 400,
            isRaw: true,
            body: {
                "message" : "Cannot delete. Vocabulary not exists."
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
        } else {
            context.res = {
                status: 200,
                isRaw: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
    } catch (err) {
        context.log(err.message);
        context.res = {
            status: 400,
            isRaw: true,
            body: {
                "message": err.message
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}