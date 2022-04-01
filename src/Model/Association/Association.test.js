/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"


test( `Test Association - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/association")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)
		})
})

test( `Test Post Association with blank fields - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/association/connect")
		.send({
			idExam:"",
			idLaboratory:"",
		})
		.then(response => {
			expect(response.status).toBe(500)
			expect(response.body.errors[0]).toBe("Campos vazios!")
		})
})

test( `Test Post Association with idExam blank - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/association/connect")
		.send({
			idExam:"",
			idLaboratory:"624221b27bc05f01ce2c9ce0",
		})
		.then(response => {
			expect(response.status).toBe(500)
			expect(response.body.errors[0]).toBe("Campos vazios!")
		})
})

test( `Test Post Association with idLaboratory blank - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/association/connect")
		.send({
			idExam:"6242280f11949e0615e9da33",
			idLaboratory:"",
		})
		.then(response => {
			expect(response.status).toBe(500)
			expect(response.body.errors[0]).toBe("Campos vazios!")
		})
})


test( `Test Post Association that there are - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.post("/api/association/connect")
		.send({
			idExam:"6242280f11949e0615e9da33",
			idLaboratory:"624221fe7cc0a501e9794d2e",
		})
		.then(response => {
			expect(response.status).toBe(501)
			expect(response.body.errors[0]).toBe("Este exame ja ésta vinculado a este laboratório!")
		})
})