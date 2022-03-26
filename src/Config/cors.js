module.exports = function (req,resp,next){
    resp.header('Access-Control-Allow-Origin','*')
    resp.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE')
    resp.header('Access-Control-Allow-HEADERS','Origin, X-Requested-With, Content-type, Accept, Authorization')
    next()
}