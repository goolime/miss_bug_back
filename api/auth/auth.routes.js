import express from 'express'
import { loginUser, logoutUser, addUser } from './auth.controller.js'

const router = express.Router()


router.post('/signup', addUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

export const authRoutes = router