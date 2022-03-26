
try{
	const server = require("./src/Config/server")
	require("./src/Config/database")
	require("./src/Config/routes")(server)

}
catch(e){
	console.log(`[Exception captured] = ${e}`)
}
