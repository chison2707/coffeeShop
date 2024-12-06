const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        // gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // thêm id của A vào acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (!existUserAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                });
            }
            // thêm id của B vào requestFriends của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (!existUserBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                });
            }
            // lấy độ dài acceptFriends của b và trả về cho b
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // lấy thông tin của a trả về b
            const inforUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends,
                inforUserA: inforUserA
            });
        });
        // hủy gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // xóa id của A vào acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if (existUserAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                });
            }
            // xóa id của B vào requestFriends của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if (existUserBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                });
            }

            // lấy độ dài acceptFriends của b và trả về cho b
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // lấy userId của a để trả về cho b
            socket.broadcast.emit("SERVER_RETURN_USERID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId
            });
        });
        // từ chối yêu cầu kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; //id của b

            // xóa id của A vào acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            if (existUserAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                });
            }
            // xóa id của B vào requestFriends của A
            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            if (existUserBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                });
            }
        });
        // chấp nhận yêu cầu kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; //id của b

            // thêm id của A vào friendlist của B
            // xóa id của A vào acceptFriends của B
            const existUserAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });

            const existUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            });

            let roomChat;
            // tạo phòng chat
            if (existUserAinB && existUserBinA) {
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "Admin"
                        },
                        {
                            user_id: myUserId,
                            role: "Admin"
                        }
                    ]
                });
                await roomChat.save();
            }

            if (existUserAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { acceptFriends: userId }
                });
            }
            // thêm id của B vào friendlist của A
            // xóa id của B vào requestFriends của A

            if (existUserBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { requestFriends: myUserId }
                });
            }
        });
    });
}