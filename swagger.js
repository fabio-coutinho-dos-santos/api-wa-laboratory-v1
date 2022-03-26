
const swaggerAutogen = require("swagger-autogen")()

const outputFile = "../../swagger_output.json"
const endpointsFiles = ["./src/Configurations/routes.js"]

swaggerAutogen(outputFile, endpointsFiles)