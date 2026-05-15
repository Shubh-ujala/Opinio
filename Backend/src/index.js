import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route.js'
import pollRouter from './routes/polls.route.js'
import responseRoute from './routes/responses.route.js'

export function expressServer() {
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    }));

    app.get('/health', (req, res) => {
        res.status(200).json({ healthy: true })
    })

    app.use('/api/auth', authRouter)
    app.use('/api/polls', pollRouter)
    app.use('/api/responses', responseRoute)

    return app;
}