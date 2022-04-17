/* eslint-disable no-undef */
const request = require("supertest")
const HttpStatusCodes = require("../../Untils/HttpStatusCodes")
const URL_TEST = "localhost:3000"


test( `Test Association - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/association")
		.then(response => {
			expect(response.status).toBe(HttpStatusCodes.code.SUCCESS)
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
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
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
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
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
			expect(response.status).toBe(HttpStatusCodes.code.INTERNAL_SERVER)
		})
})


// test( `Test Post Association that there are - ${URL_TEST}`,()=>{
// 	return request (URL_TEST)
// 		.post("/api/association/connect")
// 		.send({
// 			idExam:"62570bab947c790443126713",
// 			idLaboratory:"62570b372b11f00434150d5a",
// 		})
// 		.then(response => {
// 			expect(response.status).toBe(HttpStatusCodes.code.BAD_REQUEST)
// 			expect(response.body.errors[0]).toBe("Exam already linked with this laboratory!")
// 		})
// })