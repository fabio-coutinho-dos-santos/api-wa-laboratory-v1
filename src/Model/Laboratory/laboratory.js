const restful = require("node-restful")
const monggose = require("mongoose")

const laboratorySchema = new monggose.Schema({
	name:{type:String,require:true,min:3},
	address:{type:String,require:true,min:6},
	status:{type:String,require:true,
		enum: {
			values:["Active","Inactive"],
			message: "Field status must have Active or Inactive"
		}
	}
})

module.exports = restful.model("Laboratory",laboratorySchema)