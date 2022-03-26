const express = require("express")

module.exports = function(server)
{
	const api = express.Router()
	server.use("/api",api)

	const laboratoryService = require("../Model/laboratoryService")
	laboratoryService.register(api,"/laboratory")
}