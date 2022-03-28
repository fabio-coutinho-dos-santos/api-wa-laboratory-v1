const express = require("express")

module.exports = function(server)
{
	const api = express.Router()
	server.use("/api",api)

	const laboratoryService = require("../Model/Laboratory/laboratoryService")
	laboratoryService.register(api,"/laboratory")

	const examService = require("../Model/Exam/examService")
	examService.register(api,"/exam")

	const associationService = require("../Model/Association/AssociationService")
	associationService.register(api,"/association")
}