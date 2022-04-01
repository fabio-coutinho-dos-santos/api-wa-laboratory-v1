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


// ================================================================= Functions to remove exam ==================================================================
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

module.exports = Exam