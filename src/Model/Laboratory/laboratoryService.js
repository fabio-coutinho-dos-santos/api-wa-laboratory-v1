const Laboratory = require("./laboratory")
const lodash = require("lodash")
const HttpStatusCodes = require("../../Untils/HttpStatusCodes")

Laboratory.methods(["get","post","put","delete"])
Laboratory.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

Laboratory.after("post",sendErrorsOrNext).after("put",sendErrorsOrNext)

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


// route to get actives laboratories
Laboratory.route("actives",(req,resp) => {
	try{
		Laboratory.aggregate([
			{$match:{status:"Active"}}],
		function (err, laboratoriesActives) {
			if(err) {
				return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
			}else{
				resp.json((laboratoriesActives))
			}
		})
	}
	catch(e){
		console.log(`[Exception captured] = ${e}`)
	}
})

// ================================================== Functions to remove laboratory, chaged your status =============================================================

Laboratory.route("remove",(req,resp) => {
	try{
		const idLaboratory = req.body.idLaboratory
		validateFieldBlanc(idLaboratory).then((response)=>{
			if(response){
				Laboratory.updateOne(
					{ _id: idLaboratory },
					{ $set: { "status": "Inactive" } },(err)=>{
						if(err) {
							resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
						}
						else{
							resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Laboratory removed successfully!"]})
						}
					}
				)
			}else{
				resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:["Blank field!"]})
			}
		})
	}
	catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on removing laboratorry!"}])
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

// =================================================================================================================================================================


// ========================================================= routes to execute functions on batch registers ==================================================

Laboratory.route("saveBatch",(req,resp)=>{

	try{
	
		const laboratories = req.body.laboratories

		for(let i=0; i<laboratories.length; i++)
		{
			let laboratory = new Laboratory(laboratories[i])
			laboratory.save((err)=>{
				if(err){
					return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
				}
				if(i == laboratories.length-1){
					resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Laboratories stored successfully!"]})
				}
			})
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error storing Laboratories!" + e}])
	}
})

Laboratory.route("deleteBatch",(req,resp)=>{
	let cont=0
	try{
		const ids = req.body.ids

		for(let i=0; i<ids.length; i++)
		{
			Laboratory.find({_id:ids[i]}).remove((err,exam)=>{
				cont += exam.deletedCount
				if(err){
					return resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
				}else{
					if(i == ids.length-1){
						resp.status(HttpStatusCodes.code.SUCCESS).json({response:[cont+" laboratories deleted successfully!"]})
					}
				}
			})
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error deleting laboratories!" + e}])
	}
})

Laboratory.route("updateBatch",(req,resp)=>{

	try{
	
		const laboratories = req.body.laboratories
		for(let i=0; i<laboratories.length; i++)	
		{
			Laboratory.updateOne(
				{ _id: laboratories[i]._id },
				{ $set: { "status": laboratories[i].status , "address":laboratories[i].address, "name":laboratories[i].name} 
				},(err)=>{
					if(err) {
						resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json({errors:[err]})
					}
					else{
						if(i == laboratories.length-1){
							resp.status(HttpStatusCodes.code.SUCCESS).json({response:["Laboratories updated successfully!"]})
						}
					}
				}
			)
		} 

	}catch(e){
		resp.status(HttpStatusCodes.code.INTERNAL_SERVER).json([{errors:"Error on updating Laboratories!" + e}])
	}
})

// =================================================================================================================================================================


module.exports = Laboratory