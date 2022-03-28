const Association = require("./Association")
const lodash = require("lodash")

Association.methods(["get","post","put","delete"])
Association.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Association.after("post",sendErrorsOrNext).after("put",sendErrorsOrNext)

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


module.exports = Association