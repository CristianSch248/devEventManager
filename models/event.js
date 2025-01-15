const mongoose = require('mongoose')

const Event = new mongoose.Schema({
    nome: {
        type: String
    }
})