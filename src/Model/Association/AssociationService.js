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
						resp.status(500).json({errors:[err]})
					}else if(exam == ""){
						resp.status(501).json({errors:["Este exame não está cadastrado!"]})
					}else{
						Laboratory.aggregate([
							{$match:{status:"Active"}},
							{$match:{_id:ObjectID(idLaboratory)}}
						],
						function (err, exam) {
							if(err) {
								resp.status(500).json({errors:[err]})
							}else if(exam == ""){
								resp.status(501).json({errors:["Este laboratório não está cadastrado!"]})
							}else{
								let association = new Association({idExam:idExam,idLaboratory:idLaboratory})
								checkIfThereAreAssociation(idExam,idLaboratory).then((response)=>{
									if(!response){
										association.save(err=>{
											if(err){
												resp.status(500).json({errors:[err]})
											}else{
												resp.status(201).json({Response:["Exame cadastrado com sucesso!"]})
											}
										})
									}else{
										resp.status(501).json({errors:["Este exame ja ésta vinculado a este laboratório!"]})
									}
								})
						
							}
						})
					}
				})
			}else{
				resp.status(500).json({errors:["Campos vazios!"]})
			}
		})
	}catch(e){
		resp.status(500).json([{errors:"Erro ao vincular exame ao laboratório!"}])
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