import { Server } from 'socket.io';
import http from 'http';
import { updateBookmark } from 'BookmarkService';


async function socketConnection(server: http.Server) {
    const io = new Server(server);
    io.on("connection", (socket) => {
        console.log('새로운 클라이언트가 연결되었습니다.');

        // 클라이언트에서 전달한 토큰 확인
        // const token = socket.handshake.auth.token;
        // if(!token){
        //     console.log('토큰이 없습니다. 연결을 종료합니다.');
        //     socket.disconnect();
        //     return;
        // }

        // 토큰 검증하고 클라이언트 인증하는 작업 수행

        // 클라이언트와의 통신
        socket.on('bookmarkStatus', async (user, id, status) => {
            try {
                console.log('클라이언트로부터 북마크 상태를 받았습니다:', user, id, status);
                const result = await updateBookmark(status, id, user);
                io.emit('bookmarkStatus', result);
            } catch (error) {
                io.emit('error', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('클라이언트와의 연결이 종료되었습니다.');
        });
    });
}

export default socketConnection;