import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import {Socket} from "socket.io";
import {SignalData} from "./types/signalData";

dotenv.config();

const PORT = process.env.PORT || 5001;


const server = http.createServer()
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

const app: Express = express();

app.use(cors());


app.get("/ping", (req: Request, res: Response) => {
	res.send("pong");
});

// Socket IO
// TODO replace socket.id by real userID
io.on("connection", (socket: Socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
	});

	socket.on("sending_signal", (payload: SignalData) => {
		const signal: SignalData = {
			signal: payload.signal,
			from: payload.from,
		}
		io.to(payload.to?.id)
			.emit("receiving_signal", signal);
	});

	socket.on("returning_signal", (payload: SignalData) => {
		const signal: SignalData = {
			signal: payload.signal,
		}
		io.to(payload.to?.id).emit("accepted_signal", signal);
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
