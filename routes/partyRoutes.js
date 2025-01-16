const router = require("express").Router()
const jwt = require("jsonwebtoken")
const multer = require("multer")

const Event = require("../models/event")
const User = require("../models/user")

const diskStorage = require('../helpers/file-storage');
const verifyToken = require("../helpers/check-token");
const getUserByToken = require("../helpers/get-user-by-token");

const upload = multer({ storage: diskStorage })

router.post("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

  const title = req.body.title;
  const description = req.body.description;
  const partyDate = req.body.party_date;

  let files = [];

  if(req.files) files = req.files.photos

  if(title == "null" || description == "null" || partyDate == "null") {
    return res.status(400).json({ error: "Preencha pelo menos nome, descrição e data." });
  }

  const token = req.header("auth-token")
  const userByToken = await getUserByToken(token)
  const userId = userByToken._id.toString()
  const user = await User.findOne({ _id: userId })

  if (!user) return res.status(400).json({ error: "O usuário não existe!" });

  let photos = []

  if(files && files.length > 0) {    
    files.forEach((photo, i) => {
      photos[i] = photo.path
    })
  }

  const event = new Event({
    title: title,
    description: description,
    partyDate: partyDate,
    photos: photos,
    privacy: req.body.privacy,
    userId: userId
  })

  try {      
    const newEvent = await event.save()
    res.json({ error: null, msg: "Evento criado com sucesso!", data: newEvent })
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/all", async (req, res) => {
  try {      
    const events = await Event.find({ privacy: false }).sort([['_id', -1]]);
    res.json({ error: null, events: events })
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/userevents", verifyToken, async function (req, res) {
  try {      
    const token = req.header("auth-token")
    const user = await getUserByToken(token)
    const userId = user._id.toString()

    const events = await Event.find({ userId: userId })
    res.json({ error: null, events: events })
  } catch (error) {
    res.status(400).json({ error })   
  }
})

router.get("/userevent/:id", verifyToken, async function (req, res) {
  try {      
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userId = user._id.toString();
    const eventId = req.params.id;

    const event = await Event.findOne({ _id: eventId, userId: userId });
    res.json({ error: null, event: event });
  } catch (error) {
    res.status(400).json({ error })   
  }
})

router.get("/:id", async (req, res) => {

  const id = req.params.id
  const event = await Event.findOne({ _id: id })

  if(event === null) res.json({ error: null, msg: "Este evento não existe!" })
  
  if(event.privacy === false) {
    res.json({ error: null, event: event })
  } else {

    const token = req.header("auth-token")
    const user = await getUserByToken(token)
    
    const userId = user._id.toString()
    const eventUserId = party.userId.toString()

    if(userId == eventUserId) {
      res.json({ error: null, event: event })
    } else {
      res.status(401).json({ error: "Acesso negado!" })
    }
  }  
})

router.delete("/", verifyToken, async (req, res) => {

  const token = req.header("auth-token");
  const user = await getUserByToken(token);
  const eventId = req.body.id;
  const userId = user._id.toString();

  try {      
    await Event.deleteOne({ _id: eventId, userId: userId });
    res.json({ error: null, msg: "Evento removido com sucesso!" });
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.put("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

  const title = req.body.title
  const description = req.body.description
  const eventDate = req.body.eventDate
  const eventId = req.body.id
  const eventUserId = req.body.user_id

  let files = []

  if(req.files) files = req.files.photos

  if(title == "null" || description == "null" || partyDate == "null") {
    return res.status(400).json({ error: "Preencha pelo menos nome, descrição e data." })
  }

  const token = req.header("auth-token")
  const userByToken = await getUserByToken(token)
  const userId = userByToken._id.toString()
  const user = await User.findOne({ _id: userId })

  if (!user) return res.status(400).json({ error: "O usuário não existe!" });

  const event = {
    id: eventId,
    title: title,
    description: description,
    eventDate: eventDate,
    privacy: req.body.privacy,
    userId: eventUserId
  }

  let photos = []

  if(files && files.length > 0) {    
    files.forEach((photo, i) => {
      photos[i] = photo.path
    })
    event.photos = photos
  }
  
  try {      
    const updatedEvent = await Event.findOneAndUpdate({ _id: eventId, userId: eventUserId }, { $set: event }, {new: true})
    res.json({ error: null, msg: "Evento atualizado com sucesso!", data: updatedEvent })
  } catch (error) {
    res.status(400).json({ error })    
  }
})

module.exports = router