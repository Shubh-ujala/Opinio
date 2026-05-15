import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { expressServer } from './src/index.js';
import 'dotenv/config'
import mongoose from 'mongoose';

async function main(){
    // 1. Create the Express app
    const app = expressServer();

    // 2. Create the http server WITH the app as request handler
    const server = http.createServer(app);

    // 3. Attach Socket.IO to the http server
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        }
    });

    // 4. Make io accessible in routes via req.app.get('io')
    app.set('io', io);

    io.on('connection', socket => {
        socket.on('join-poll', pollId => socket.join(`poll-${pollId}`));
    });

    const PORT = process.env.PORT;

    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('DB Connected!');
        server.listen(PORT, ()=>{
            console.log(`Server is listening on port: http://localhost:${PORT}`);
        });
    }).catch(err => console.log(err));
}
main();