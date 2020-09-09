import express from "express";
const app = express();
app.use(express.json());
const routes = require('./routes');
app.use("/api", routes);
const PORT = 4000;
app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`));
