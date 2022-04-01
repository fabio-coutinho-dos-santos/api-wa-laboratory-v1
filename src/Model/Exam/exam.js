const restful = require("node-restful")
const monggose = require("mongoose")

const examchema = new monggose.Schema({
	name:{type:String,required:true},
	type:{type:String,required:true,
		enum: {
			values:["Analysis","Clinic","Image"],
			message: "Field status must have Active or Inactive"
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