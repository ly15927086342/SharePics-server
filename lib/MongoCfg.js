const url = "mongodb://localhost:27017";
const dbName = "sp_server"
const option = {
	useNewUrlParser:true,
	useUnifiedTopology:true
}

module.exports = {
	url:url,
	dbName:dbName,
	option:option
}
	