const Exam = require("./exam")
const lodash = require("lodash")

Exam.methods(["get","post","put","delete"])
Exam.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Exam.after("post",sendErrorsOrNext).after("put",sendErrorsOrNext)

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

//route to return actives exams
Exam.route("actives",(req,resp) => {
	try{
		Exam.aggregate([
			{$match:{status:"Active"}}],
		function (err, examActives) {
			if(err) {
				return resp.status(500).json({errors:[err]})
			}else{
				resp.json((examActives))
			}
		})
	}
	catch(e){
		resp.status(500).json([{errors:"Error on get actives exams!"}])
	}
})


// ================================================================= Functions to remove exam ==================================================================

Exam.route("remove",(req,resp) => {
	try{
		const idExam = req.body.idExam
		validateFieldBlanc(idExam).then((response)=>{
			if(response){
				Exam.updateOne(
					{ _id: idExam },
					{ $set: { "status": "Inactive" } },(err)=>{
						if(err) {
							resp.status(500).json({errors:[err]})
						}
						else{
							resp.status(200).json({response:["Exame removido com sucesso!"]})
						}
					}
				)
			}else{
				resp.status(500).json({errors:["Campo vazio!"]})
			}
		})
	}
	catch(e){
		resp.status(500).json([{errors:"Erro ao remover exame!"}])
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

//route to return actives exams by name
Exam.route("getActivesByName",(req,resp)=>{

	const name = req.query.name
	console.log(name)

	try{
		Exam.aggregate([
			{$match:
				{
					name:name,
					status:"Active"
				}}],
		function (err, examsActives) {
			if(err) {
				return resp.status(500).json({errors:[err]})
			}else{
				resp.json((examsActives))
			}
		})
	}
	catch(e){
		resp.status(500).json([{errors:"Error on get actives exams by nam!"}])
	}

})


//route to save a batch of exams
Exam.route("saveBatch",(req,resp)=>{

	try{
	
		const exams = req.body.exams

		for(let i=0; i<exams.length; i++)
		{
			let exam = new Exam(exams[i])
			exam.save((err)=>{
				if(err){
					return resp.status(500).json({errors:[err]})
				}
				if(i == exams.length-1){
					resp.status(200).json({response:["Exams stored successfully!"]})
				}
			})
		} 

	}catch(e){
		resp.status(500).json([{errors:"Error on stored exams!" + e}])
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
					return resp.status(500).json({errors:[err]})
				}else{
					if(i == ids.length-1){
						resp.status(200).json({response:[cont+" exams deleted successfully!"]})
					}
				}
			})
		} 

	}catch(e){
		resp.status(500).json([{errors:"Error on stored exams!" + e}])
	}
})


module.exports = Exam