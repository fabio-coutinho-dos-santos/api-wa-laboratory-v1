const Association = require("./Association")
const Exam = require("../Exam/exam")
const Laboratory = require("../Laboratory/laboratory")
const lodash = require("lodash")
const HttpStatusCodes = require("../../Untils/HttpStatusCodes")

Association.methods(["get","put","delete"])
Association.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Association.after("put",sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next){
	const bundle = resp.locals.bundle

	if(bundle.errors){
		var errors = parseErrors(bundle.errors)
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors})
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

// ================================================================= Functions to save association ==================================================================

Association.route("save",(req,resp) => {
	try{
		const idExam = req.body.idExam
		const idLaboratory = req.body.idLaboratory

		validateBlankIds(idExam,idLaboratory).then((response)=>{
			if(response){
				let ObjectID = require("mongodb").ObjectID
				Exam.aggregate([
					{$match:{status:"Active"}},
					{$match:{_id:ObjectID(idExam)}}
				],
				function (err, exam) {
					if(err) {
						resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
					}else if(exam == ""){
						resp.status(HttpStatusCodes.code.BAD_REQUEST).json({errors:["Exam don't registered!"]})
					}else{
						Laboratory.aggregate([
							{$match:{status:"Active"}},
							{$match:{_id:ObjectID(idLaboratory)}}
						],
						function (err, exam) {
							if(err) {
								resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
							}else if(exam == ""){
								resp.status(HttpStatusCodes.code.BAD_REQUEST).json({errors:["Laboratory don't registered!"]})
							}else{
								let association = new Association({idExam:idExam,idLaboratory:idLaboratory})
								checkIfThereAreAssociation(idExam,idLaboratory).then((response)=>{
									if(!response){
										association.save(err=>{
											if(err){
												resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
											}else{
												resp.status(HttpStatusCodes.code.SUCCESS).json({Response:["Exam linked successfully!"]})
											}
										})
									}else{
										resp.status(HttpStatusCodes.code.BAD_REQUEST).json({errors:["Exam already linked with this laboratory!"]})
									}
								})
						
							}
						})
					}
				})
			}else{
				resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:["Blank fields!"]})
			}
		})
	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on to link exam!"}])
	}

})

//check if fileds don't have blank
let validateBlankIds = (idExam,idLaboratory)=>{

	return new Promise (resolve =>{
		try{
			if(idExam === "" || idLaboratory ===""){
				resolve(false)
			}else{
				resolve(true)
			}
		}catch(e){
			resolve(false)
		}
	})
}	

// check if there are association with idExam an idLaboratory
let checkIfThereAreAssociation = (idExam,idLaboratory) =>{ 

	return new Promise (resolve=>{
		try{
			Association.aggregate([
				{$match:{idExam:idExam}},
				{$match:{idLaboratory:idLaboratory}}
			],
			function (err, exam) {
				if(err) {
					resolve(true)
				}else if(exam == ""){
					resolve(false)
				}else{
					resolve(true)
				}
			})
		}catch(e){
			resolve(false)
		}
	})
	
}

// ==================================================================================================================================================================


module.exports = Association