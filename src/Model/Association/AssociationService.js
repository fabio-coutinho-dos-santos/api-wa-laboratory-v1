const Association = require("./Association")
const Exam = require("../Exam/exam")
const Laboratory = require("../Laboratory/laboratory")
const lodash = require("lodash")

Association.methods(["get","put","delete"])
Association.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Association.after("put",sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next){
	const bundle = resp.locals.bundle

	if(bundle.errors){
		var errors = parseErrors(bundle.errors)
		resp.status(500).json({errors})
	}else{
		next()
	}
}

function parseErrors(nodeRestfulErrors)
{
	const errors = [] 
	lodash.forIn(nodeRestfulErrors, error=>{
		errors.push(error.message)
	})

	return errors
}

Association.route("count",(req,resp) => {
	try{
		Association.count((error, value)=>{
			if(error){
				resp.status(500).json({errors:[error]})
				resp.next()
			}else{
				resp.json({value})
			}
		})
	}
	catch(e){
		console.log(`[Exception captured] = ${e}`)
	}
})

Association.route("save",(req,resp) => {

	const idExam = req.body.idExam
	const idLaboratory = req.body.idLaboratory

	findExam(idExam).then((respExam)=>{
		console.log(respExam)
		findLaboratory(idLaboratory).then((respLaboratpry)=>{
			console.log(respExam)
			if(respExam == 200 && respLaboratpry == 200){
				resp.status(200).send("Ok")
			}else{
				resp.status(500).send("Error")
			}
		})
	})
})


let findExam = (idExam) => {
	let ObjectID = require("mongodb").ObjectID
	return new Promise(resolve => {
		Exam.aggregate([
			{$match:{status:"Active"}},
			{$match:{_id:ObjectID(idExam)}}
		],
		function (err, exam) {
			if(err) {
				resolve(501)
			}else if(exam == ""){
				resolve(502)
			}else{
				console.log(exam)
				resolve(200)
			}
		})
	// 	Exam.findById({_id:idExam},(err, exam)=>{
	// 		if(err) {
	// 			resolve(400)
	// 		}else if(exam){
	// 			if(exam == "")
	// 				resolve(500)
	// 			else{
	// 				Exam.aggregate([
	// 					{$match:{status:"Active"}},
	// 					{$match:{_id:ObjectID(idExam)}}
	// 				],
	// 				function (err, exam) {
	// 					if(err) {
	// 						resolve(501)
	// 					}else if(exam == ""){
	// 						resolve(502)
	// 					}else{
	// 						console.log(exam)
	// 						resolve(200)
	// 					}
	// 				})
	// 			}	
	// 		}else{
	// 			resolve(400)
	// 		}
	// 	})
	})
}

let findLaboratory = (idlaboratory) => {

	return new Promise(resolve => {

		Laboratory.findById({_id:idlaboratory},(err, lab)=>{
			if(err) {
				resolve(400)
			}else if(lab){
				if(lab == "")
					resolve(500)
				else{
					resolve(200)
				}	
			}else{
				resolve(400)
			}
		})
	})
}



module.exports = Association