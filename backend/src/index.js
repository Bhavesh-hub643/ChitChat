import "./env.js";
import connectDB from "./db/index.js";
import { httpServer } from "./socket/socket.js";


connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(`DB connection failed: ${err}`);
  });