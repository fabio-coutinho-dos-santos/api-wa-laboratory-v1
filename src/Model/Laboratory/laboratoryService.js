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


module.exports = Laboratory