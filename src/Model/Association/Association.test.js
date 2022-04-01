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

// test( `Test Post Association - ${URL_TEST}`,()=>{
// 	return request (URL_TEST)
// 		.post("/api/association")
// 		.send({
// 			idExam:"",
// 			idLaboratory:"",
// 		})
// 		.then(response => {
// 			expect(response.status).toBe(201)
// 		})
// })