/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"

// =================================================================== Test Acives Route ==================================================================================

test( `Test Get list actives Laboratories ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/laboratory/actives")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)

		})
})

// =====================================================================================================================================================================

// =================================================================== Test Get Route ==================================================================================


test( `Test Laboratory ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/laboratory")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)
		})
})

// =====================================================================================================================================================================


// =================================================================== Test PUT Route ==================================================================================


test( `Test PUT Laboratory with id stored ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/laboratory/62570b3f2b11f00434150d5c")
		.send({
			"name": "Test2",
			"address": "Test,Test2",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.name).toBe("Test2")
			expect(response.body.address).toBe("Test,Test2")
			expect(response.body.status).toBe("Active")
		})
})


test( `Test PUT laboratory field status wrong ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/laboratory/6244d5508571c005beaee5f2")
		.send({
			"name": "laboratory Test",
			"address": "test",
			"status": "Actives"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

test( `Test PUT Laboratory with false id ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.put("/api/laboratory/6242227d4ae0a")
		.send({
			"name": "Test2",
			"address": "Test,Test2",
			"status": "Active"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

// =====================================================================================================================================================================

// =================================================================== Test Remove Route ==================================================================================


test( `Test Laboratory chage status to inactive with empty field ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory/remove")
		.send({
			idLaboratory:"",
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

test( `Test Laboratory chage status to inactive correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory/remove")
		.send({
			idLaboratory:"6242254f1677ae0543d2ac28",
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.response[0]).toBe("Laboratório removido com sucesso!")
		})
})


// =====================================================================================================================================================================


// =================================================================== Test Post Route ==================================================================================

test( `Test Post Laboratory Fields empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory")
		.send({
			name:"",
			address:"",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

test( `Test Post Laboratory Field address empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory")
		.send({
			name:"Test",
			address:"",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

test( `Test Post Laboratory Field name empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory")
		.send({
			name:"",
			address:"Test",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})


test( `Test Post Laboratory Field status not Active or Inactive empty ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory")
		.send({
			name:"Test",
			address:"Test",
			status:"Inact"
		})
		.then(response => {
			expect(response.status).toBe(500)
		})
})

test( `Test Post Laboratory correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory")
		.send({
			name:"Test",
			address:"Test",
			status:"Inactive"
		})
		.then(response => {
			expect(response.status).toBe(201)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toBe("Test")
			expect(response.body.address).toBe("Test")
			expect(response.body.status).toBe("Inactive")
		})
})

test( `Test Post batch laboratories correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory/saveBatch")
		.send({
			laboratories:[{
				name:"Test",
				address:"Test",
				status:"Inactive"
			},{
				name:"Test",
				address:"Test",
				status:"Inactive"
			}]
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.response[0]).toBe("Laboratories stored successfully!")
		})
})


test( `Test delete batch laboratories correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory/deleteBatch")
		.send({
			ids:[
				"624227d41957aa05b389b99a",
				"624227d41957aa05b389b99a"
			]
		})
		.then(response => {
			expect(response.status).toBe(200)
		})
})

test( `Test update batch laboratories correctly ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/laboratory/updateBatch")
		.send({
			laboratories:[{
				_id: "62570b372b11f00434150d5a",
				name:"Test",
				address:"Test",
				status:"Active"
			},{
				_id: "62570b3f2b11f00434150d5c",
				name:"Test",
				address:"Test",
				status:"Active"
			}]
		})
		.then(response => {
			expect(response.status).toBe(200)
		})
})

// ===================================================================+++++++++++++++++==================================================================================



