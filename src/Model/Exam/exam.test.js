/* eslint-disable no-undef */
const request = require("supertest")
const HttpStatusCodes = require("../../Untils/HttpStatusCodes")
const URL_TEST = "localhost:3000"


test( `Test get all exams Exam - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/exam")
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body).toBeInstanceOf(Array)
		})
})



// =================================================================== Test Acives Route ==================================================================================

test( `Test Get list actives Exams ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/exam/actives")
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body).toBeInstanceOf(Array)

		})
})

// ========================================================================================================================================================================

// =================================================================== Test Remove Route ==================================================================================


test( `Test exam change status to inactive with empty field ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/remove")
		.send({
			idExam:"",
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test exam change status to inactive correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/remove")
		.send({
			idExam:"625ca331295a8b009736c807",
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body.response[0]).toBe("Exam removed successfully")
		})
})


// =====================================================================================================================================================================


// =================================================================== Test PUT Route ==================================================================================


test( `Test PUT exam with id stored ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/625ca331295a8b009736c807")
		.send({
			"name": "Exam Test",
			"type": "Clinical",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body.name).toBe("Exam Test")
			expect(response.body.type).toBe("Clinical")
			expect(response.body.status).toBe("Active")
		})
})

test( `Test PUT exam field type wrong ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/625ca331295a8b009736c807")
		.send({
			"name": "Exam Test",
			"type": "Clinical",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test PUT exam field status wrong ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/625ca331295a8b009736c807")
		.send({
			"name": "Exam Test",
			"type": "Clinical",
			"status": "Actives"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})


test( `Test PUT exam with false id ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/6242227d4ae0a")
		.send({
			"name": "Test2",
			"address": "Test,Test2",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

// =====================================================================================================================================================================


// =================================================================== Test Post Route ==================================================================================

test( `Test Post exam Field name empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"",
			type:"Image",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test Post exam Field address empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"Test",
			type:"",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test Post exam Field status empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"Test",
			type:"",
			status:""
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})


test( `Test Post exam Field status not Active or Inactive ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"Test",
			type:"Image",
			status:"Inact"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test Post exam Field type different od Image, Clinical ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"Test",
			type:"Image",
			status:"Inact"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test Post exam correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam")
		.send({
			name:"Test",
			type:"Image",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(201)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toBe("Test")
			expect(response.body.type).toBe("Image")
			expect(response.body.status).toBe("Inactive")
		})
})

test( `Test Post batch exams correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/saveBatch")
		.send({
			exams:[{
				name:"Test",
				type:"Image",
				status:"Inactive"
			},{
				name:"Test",
				type:"Image",
				status:"Inactive"
			}]
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body.response[0]).toBe("Exams stored successfully!")
		})
})


// test( `Test delet batch exams correctly ${URL_TEST}`,()=>{
// 	return request (URL_TEST)
// 		.post("/api/exam/deleteBatch")
// 		.send({
// 			ids:[
// 				"625ca331295a8b009736c807",
// 				"625ca534295a8b009736c811"
// 			]
// 		})
// 		.then(response => {
// 			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
// 		})
// })

test( `Test update batch laboratories correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/updateBatch")
		.send({
			exams:[{
				_id:"625ca331295a8b009736c807",
				name:"Exam Test2",
				type:"Image",
				status:"Active"
			},{
				_id:"625ca534295a8b009736c811",
				name:"Test",
				type:"Image",
				status:"Active"
			}]
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
		})
})

// ===================================================================+++++++++++++++++==================================================================================


test( `Test route to get laboratories associated with a exam by exam name ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/exam/getActivesByName?name=Exam Test2")
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body).toBeInstanceOf(Array)
		})
})
