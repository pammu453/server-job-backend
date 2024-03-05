import express from 'express'
import { login, logout, register,getUser } from '../controllers/user.controllers.js'
import { varifyToken } from '../utils/varifyUser.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", varifyToken, logout)
router.get("/getUser", varifyToken, getUser)

export default router