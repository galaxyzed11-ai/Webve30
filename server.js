var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: { origin: "*" } // Cho phép kết nối từ mọi nguồn
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // 1. Xử lý tham gia phòng
    // Client phải gửi sự kiện này đầu tiên khi vào trang
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // 2. Xử lý vẽ (Chỉ gửi cho người trong cùng phòng)
    socket.on('canvas-data', (data) => {
        // data lúc này client gửi lên phải có dạng: { room_id: "1", image: "base64..." }
        const { room_id, image } = data;
        
        // Gửi cho tất cả người trong phòng (trừ người gửi)
        socket.to(room_id).emit('canvas-data', image);
    });

    // 3. Xử lý Xóa bảng (Clear)
    socket.on('trigger-clear', (roomId) => {
        socket.to(roomId).emit('trigger-clear');
    });

    // 4. Xử lý Undo (Đồng bộ)
    socket.on('trigger-undo', (roomId) => {
        socket.to(roomId).emit('trigger-undo');
    });

    // 5. Xử lý Redo (Đồng bộ)
    socket.on('trigger-redo', (roomId) => {
        socket.to(roomId).emit('trigger-redo');
    });
});

var server_port = process.env.YOURPORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Server running on port: " + server_port);
});