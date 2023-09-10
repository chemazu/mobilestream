import express from "express";
import setupSocketIO from "./socketSetup.js";

const app = express();
// const server = setupSocketIO(app);

const server = setupSocketIO(app);
app.get("/yes", (req, res) => {
  res.json("here");
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App is Listenng on port ${PORT}`));
