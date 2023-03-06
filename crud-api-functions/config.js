var connection_string   = `${process.env.DB_CONNECTION_CONFIG}`

var config = {}
connection_string = connection_string.split(" ")
connection_string.forEach((el) => {
  el = el.split("=");
  config[el[0]]=el[1];
})


module.exports = {
    DB_CONN_CONFIG: config
};