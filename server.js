const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const dbName = "devEventMng"
const port = 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect(`mongodb://localhost/${dbName}`)

app.get('/',  (req, res) => {
    res.json({Message: 'Serviço Dev Event Manager Rodando'})
})

app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}/`)
})
