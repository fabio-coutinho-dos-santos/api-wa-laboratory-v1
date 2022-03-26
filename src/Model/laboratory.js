const restful = require("node-restful")
const monggose = require("mongoose")

const laboratorySchema = new monggose.Schema({
	name:{type:String,require:true},
	address:{type:String,require:true},
	status:{type:String,require:true}
})

module.exports = restful.model("Laboratory",laboratorySchema)