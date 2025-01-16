const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const partyRouter = require("./routes/partyRoutes.js");

const dbName = "devEventMng"
const port = 3000

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))

app.use("/api/auth", authRouter);
app.use("/api/user", verifyToken, userRouter);
app.use("/api/party", partyRouter);

mongoose.connect(`mongodb://localhost/${dbName}`)

app.get('/',  (req, res) => {
    res.json({Message: 'Serviço Dev Event Manager Rodando!!!'})
})

app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}/`)
})
