import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import http from "node:http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB()
  .then(() => httpServer.listen(PORT, () => console.log(`Server on ${PORT}`)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });