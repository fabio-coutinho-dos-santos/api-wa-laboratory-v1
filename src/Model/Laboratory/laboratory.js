const restful = require("node-restful")
const monggose = require("mongoose")

const laboratorySchema = new monggose.Schema({
	name:{type:String,require:true},
	address:{type:String,require:true},
	status:{type:String,require:true,
		enum: {
			values:["Active","Inactive"],
			message: "Field status must have Active or Inactive"
		}
	}
})

module.exports = restful.model("Laboratory",laboratorySchema)