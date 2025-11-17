import express from 'express'
import { getUser, getUsers, removeUser, updateUser, addUser } from './user.controller.js'
import { requireAuth } from '../../midleware/require-auth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', requireAuth, getUser)
router.put('/:userId',requireAuth, updateUser)
router.delete('/:userId', requireAuth, removeUser)

export const userRoutes = router
