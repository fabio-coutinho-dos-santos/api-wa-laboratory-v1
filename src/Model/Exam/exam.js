const restful = require("node-restful")
const monggose = require("mongoose")

const examchema = new monggose.Schema({
	name:{type:String,required:true},
	type:{type:String,required:true,
		enum: {
			values:["Clinical","Image"],
			message: "Field status must have Clinical or Image"
		}
	},
	status:{type:String,require:true,
		enum: {
			values:["Active","Inactive"],
			message: "Field status must have Active or Inactive"
		}
	}
})

module.exports = restful.model("Exam",examchema)