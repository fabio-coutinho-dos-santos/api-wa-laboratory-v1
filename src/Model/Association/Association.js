const restful = require("node-restful")
const monggose = require("mongoose")

const associationSchema = new monggose.Schema({
	idExam:{type:String,require:true},
	idLaboratory:{type:String,require:true}
})

module.exports = restful.model("Association",associationSchema)