const express = require('express')


module.exports = function(server)
{
    const api = express.Router()
    server.use('/api',api)

    const openApi = express.Router()
    server.use('/oapi',openApi)
    
    // const protectedApi = express.Router()
    // server.use('/api',protectedApi)
    // protectedApi.use(deviceAuth)

    // const deviceAuthService = require('../Device/deviceAuthService')
    // openApi.post('/signup',deviceAuthService.signup)
    // openApi.post('/login',deviceAuthService.login)
    // openApi.post('/validateToken',deviceAuthService.validateToken)

    // const deviceService = require('../Device/deviceService')
    // deviceService.register(protectedApi,'/device')

    // const dadoService = require('../DadoTeste/dadoService')
    // dadoService.register(openApi,'/dado')

    // const tokenService = require('../Token/tokenService')
    // tokenService.register(protectedApi,'/token')

    // const rnaDataService = require('../RnaData/rnaDataService')
    // rnaDataService.register(openApi,'/rna')
}