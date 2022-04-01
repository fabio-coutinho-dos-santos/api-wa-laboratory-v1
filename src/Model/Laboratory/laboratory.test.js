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

// ===================================================================+++++++++++++++++==================================================================================



