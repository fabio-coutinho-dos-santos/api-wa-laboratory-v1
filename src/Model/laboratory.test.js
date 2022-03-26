/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"


test( `Test Laboratory ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/api/laboratory")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)
		})
})