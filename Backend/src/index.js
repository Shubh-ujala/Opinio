import express from 'express';
import cors from 'cors'
import authRouter from './routes/auth.route.js'

export function expressServer(){
    const app = express();
    app.use(express.json());
    app.use(cors())

    app.get('/health',(req,res)=>{
        res.status(200).json({
            healthy : true
        })
    })

    app.use('/api/auth', authRouter)
   

    // TODO
    // Socket io connection

    return app;
}