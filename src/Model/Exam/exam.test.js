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


test( `Test exam chage status to inactive with empty field ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/remove")
		.send({
			idExam:"",
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test exam chage status to inactive correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/remove")
		.send({
			idExam:"6244d5508571c005beaee5f2",
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
		.put("/api/exam/62570bab947c790443126713")
		.send({
			"name": "Exam Test",
			"type": "Clinic",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
			expect(response.body.name).toBe("Exam Test")
			expect(response.body.type).toBe("Clinic")
			expect(response.body.status).toBe("Active")
		})
})

test( `Test PUT exam field type wrong ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/6244d5508571c005beaee5f2")
		.send({
			"name": "Exam Test",
			"type": "Clinica",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})

test( `Test PUT exam field status wrong ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/exam/6244d5508571c005beaee5f2")
		.send({
			"name": "Exam Test",
			"type": "Clinica",
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

test( `Test Post exam Field type different od Image, Clinic and Analysis ${URL_TEST}`,()=>{
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


test( `Test delet batch exams correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/deleteBatch")
		.send({
			ids:[
				"624227d41957aa05b389b99a",
				"624227d41957aa05b389b99a"
			]
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
		})
})

test( `Test update batch laboratories correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/exam/updateBatch")
		.send({
			exams:[{
				_id:"62570bab947c790443126713",
				name:"Test",
				type:"Image",
				status:"Active"
			},{
				_id:"62570bab947c790443126713",
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
