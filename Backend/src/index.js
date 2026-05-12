import express from 'express';
import cors from 'cors'
import { connectDB } from './db/db.js';

export function expressServer(){
    const app = express();
    app.use(express.json());
    app.use(cors())

    app.get('/health',(req,res)=>{
        res.status(200).json({
            healthy : true
        })
    })
   

    // TODO
    // Socket io connection

    return app;
}