import http from 'http'
import app from './app.js'

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(PORT,(error)=>{
    if(error)console.log(error.message);
    console.log(`Server running on port ${PORT}...`);
})