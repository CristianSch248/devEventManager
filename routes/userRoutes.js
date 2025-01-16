const router = require("express").Router()
const bcrypt = require("bcrypt")

const User = require("../models/user")

const verifyToken = require("../helpers/check-token")
const getUserByToken = require("../helpers/get-user-by-token")

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ _id: id }, {password: 0})
  if (!user) return res.status(400).json({ error: "O usuário não existe!" })
  res.json({ error: null, user })
})

router.put("/", verifyToken, async (req, res) => {

  const token = req.header("auth-token")
  const user = await getUserByToken(token)
  const userReqId = req.body.id
  const password = req.body.password
  const confirmPassword = req.body.confirmpassword

  const userId = user._id.toString()

  if(userId != userReqId) res.status(401).json({ error: "Acesso negado!" })

  const updateData = {
    name: req.body.name,
    email: req.body.email
  }

  if(password != confirmPassword) {
    res.status(401).json({ error: "As senhas não conferem." });
  } else if(password == confirmPassword && password != null) {
    const salt = await bcrypt.genSalt(12)
    const reqPassword = req.body.password
    const passwordHash = await bcrypt.hash(reqPassword, salt)
    req.body.password = passwordHash
    updateData.password = passwordHash
  }

  try {      
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set:  updateData}, {new: true})
    res.json({ error: null, msg: "Usuário atualizado com sucesso!", data: updatedUser })
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router