const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    eventDate: {
        type: Date
    },
    photos: {
        type: Array
    },
    privacy: {
        type: Boolean
    },
    userId: {
        type: mongoose.ObjectId
    }
})

const Event = mongoose.model("Event", EventSchema)

module.exports = Event