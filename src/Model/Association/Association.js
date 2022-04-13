const restful = require("node-restful")
const monggose = require("mongoose")

const associationSchema = new monggose.Schema({
	idExam:{type:String,required:true},
	idLaboratory:{type:String,required:true}
})

module.exports = restful.model("Association",associationSchema)