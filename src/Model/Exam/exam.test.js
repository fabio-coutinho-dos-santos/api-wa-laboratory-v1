/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"


test( `Test Exam - ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/exam")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)
		})
})

// test( `Test Post Exam - ${URL_TEST}`,()=>{
// 	return request (URL_TEST)
// 		.post("/api/exam")
// 		.send({
// 			name:"",
// 			type:"Image",
// 			status:"Inactive"
// 		})
// 		.then(response => {
// 			expect(response.status).toBe(201)
// 		})
// })