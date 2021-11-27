const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const cors = require("cors");
app.use(cors());
const server = http.Server(app);
const io = socketIO(server);
io.origins("*:*");
const PORT = process.env.PORT || 5000;
const randomWords = require("random-words");
const { handlers } = require("./handlers");

app.set("port", PORT);

const state = {};

io.on("connection", function (socket) {
    const id = socket.handshake.query ? socket.handshake.query.id : null;
    if (id) {
        socket.join(id);
        io.to(id).emit("stateUpdated", state[id]);
    }
    console.log("user connected");

    socket.on("disconnect", function () {
        console.log("user disconnected");
    });

    // Add the event handlers
    for (const event in handlers) {
        socket.on(event, (eventData) => {
            const { newQuizState, messages } = handlers[event](
                state[id],
                eventData
            );
            state[id] = newQuizState;
            for (let { type, data } of messages) {
                io.to(id).emit(type, data);
            }
        });
    }

    // TODO: see if there is a better way to handle adding a new quiz
    // have client generate quiz id?
    socket.on("newQuiz", (data, callback) => {
        const id = randomWords({
            exactly: 1,
            wordsPerString: 2,
            separator: "-",
        });
        let quiz = {
            name: data.name,
            id: id.join(),
            players: [],
            currentQuestion: null,
            active: true,
            typing: [],
            showScores: true,
        };
        state[id] = quiz;
        callback(id);
    });

    io.emit("connected");
});

app.get("/ping", (request, response) => {
    response.send("pong");
});

server.listen(PORT, () => {
    console.log("Starting server on port " + PORT);
});
