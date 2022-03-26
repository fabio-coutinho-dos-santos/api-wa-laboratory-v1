/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"

// eslint-disable-next-line no-undef
beforeAll(()=>{
	console.log("Start script test with automatic deploy!")
})

test( `Test to test ${URL_TEST}`,()=>{
	return request (URL_TEST)
		.get("/")
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.text).toBe("Test Working")
		})
})