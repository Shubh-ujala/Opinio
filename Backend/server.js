import http, { Server } from 'http';
import { expressServer } from './src/index.js';
import 'dotenv/config'
import mongoose from 'mongoose';

async function main(){
    const server = http.createServer(expressServer());
    const PORT = process.env.PORT;

    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('DB Connected!');  
        server.listen( PORT, ()=>{
        console.log(`Server is listining on port : http://localhost:${PORT}`);
    })
    }).catch(err => console.log(err))  
}
main();