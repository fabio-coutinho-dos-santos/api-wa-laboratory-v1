const Laboratory = require("./laboratory")
const lodash = require("lodash")

Laboratory.methods(["get","post","put","delete"])
Laboratory.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Laboratory.after("post",sendErrorsOrNext).after("put",sendErrorsOrNext)

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


Laboratory.route("actives",(req,resp) => {
	try{
		Laboratory.aggregate([
			{$match:{status:"Active"}}],
		function (err, laboratoriesActives) {
			if(err) {
				return resp.status(500).json({errors:[err]})
			}else{
				resp.json((laboratoriesActives))
			}
		})
	}
	catch(e){
		console.log(`[Exception captured] = ${e}`)
	}
})

Laboratory.route("remove",(req,resp) => {
	try{
		const idLaboratory = req.body.idLaboratory
		validateFieldBlanc(idLaboratory).then((response)=>{
			if(response){
				Laboratory.updateOne(
					{ _id: idLaboratory },
					{ $set: { "status": "Inactive" } },(err)=>{
						if(err) {
							resp.status(500).json({errors:[err]})
						}
						else{
							resp.status(200).json({response:["Laboratório removido com sucesso!"]})
						}
					}
				)
			}else{
				resp.status(500).json({errors:["Campo vazio!"]})
			}
		})
	}
	catch(e){
		resp.status(500).json([{errors:"Erro ao remover laboratório!"}])
	}
})

let validateFieldBlanc = (idLaboratory) =>{
	return new Promise (resolve =>{
		if(idLaboratory === "" || idLaboratory === null || idLaboratory === undefined){
			resolve(false)
		}else{
			resolve(true)
		}
	})
}

module.exports = Laboratory