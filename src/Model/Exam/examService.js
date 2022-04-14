const Exam = require("./exam")
const lodash = require("lodash")
const Association = require("../Association/Association")
const Laboratory = require("../Laboratory/laboratory")
const HttpStatusCodes = require("../../Untils/HttpStatusCodes")


Exam.methods(["get","post","put","delete"])
Exam.updateOptions({new:true, runValidators: true})

Exam.after("post",sendErrorsOrNext).after("put",sendErrorsOrNext)

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

//route to return actives exams
Exam.route("actives",(req,resp) => {
	try{
		Exam.aggregate([
			{$match:{status:"Active"}}],
		function (err, examActives) {
			if(err) {
				return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
			}else{
				resp.json((examActives))
			}
		})
	}
	catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on get actives exams!"}])
	}
})


// ================================================== Functions to remove exam, chaged your status =============================================================

Exam.route("remove",(req,resp) => {
	try{
		const idExam = req.body.idExam
		validateFieldBlanc(idExam).then((response)=>{
			if(response){
				Exam.updateOne(
					{ _id: idExam },
					{ $set: { "status": "Inactive" } },(err)=>{
						if(err) {
							resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
						}
						else{
							resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Exam removed successfully"]})
						}
					}
				)
			}else{
				resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:["Blank fiels!"]})
			}
		})
	}
	catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on to remove exam!"}])
	}
})

let validateFieldBlanc = (idExam) =>{
	return new Promise (resolve =>{
		if(idExam === "" || idExam === null || idExam === undefined){
			resolve(false)
		}else{
			resolve(true)
		}
	})
}

// =============================================================================================================================================================

// ============================================================ route to return actives exams by name =========================================================

//
Exam.route("getActivesByName",(req,resp)=>{
	try{
		const name = req.query.name
		console.log(name)

		Exam.findOne({name:name},function(err,exam){
			if(err) {
				return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
			}else{
				if(!exam){
					return resp.status(HttpStatusCodes.code.BAD_REQUEST).json({errors:["Exam don't found"]})
				}
				else{
					Association.aggregate([
						{$match:
						{idExam:exam.id}}
					],(err,associations)=>{
						if(err) {
							return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
						}else{
							let arrayLaboratories=[]
							getAllLaboratoryes(resp).then((laboratories)=>{
								laboratories.forEach(lab => {
									associations.forEach(assocations=> {
										if(lab._id == assocations.idLaboratory){
											arrayLaboratories.push(lab)
										}
									})
								})
								resp.json(arrayLaboratories)
							})
						}
					})

				}
			}
		})
	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on to get laboratories that have linked with this exam!"}])
	}

})

function getAllLaboratoryes(resp){

	return new Promise(resolve =>{
		Laboratory.find({},function(err,laboratories){
			if(err) {
				return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
			}else{
				resolve(laboratories)
			}
		})
	})
	
}

// =============================================================================================================================================================


// ========================================================= routes to execute functions on batch registers ==================================================


//route to save a batch of exams
Exam.route("saveBatch",(req,resp)=>{

	try{
	
		const exams = req.body.exams

		for(let i=0; i<exams.length; i++)
		{
			let exam = new Exam(exams[i])
			exam.save((err)=>{
				if(err){
					return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
				}
				if(i == exams.length-1){
					resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Exams stored successfully!"]})
				}
			})
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on stored exams!" + e}])
	}
})

//route to delete a batch exams
Exam.route("deleteBatch",(req,resp)=>{
	let cont=0
	try{
		const ids = req.body.ids

		for(let i=0; i<ids.length; i++)
		{
			Exam.find({_id:ids[i]}).remove((err,exam)=>{
				cont += exam.deletedCount
				if(err){
					return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
				}else{
					if(i == ids.length-1){
						resp.status(HttpStatusCodes.code.SUCCESS).json({response:[cont+" exams deleted successfully!"]})
					}
				}
			})
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error deleting exams!" + e}])
	}
})

Exam.route("updateBatch",(req,resp)=>{

	try{
	
		const exams = req.body.exams
		for(let i=0; i<exams.length; i++)	
		{
			Exam.updateOne(
				{ _id: exams[i]._id },
				{ $set: { "status": exams[i].status , "type":exams[i].type, "name":exams[i].name} 
				},(err)=>{
					if(err) {
						resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
					}
					else{
						if(i == exams.length-1){
							resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Exams updated successfully!"]})
						}
					}
				}
			)
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error updating exams!" + e}])
	}
})

// =============================================================================================================================================================


module.exports = Exam