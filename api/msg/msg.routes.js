import express from 'express'
import { requireAuth } from '../../midleware/require-auth.middleware.js'
import { getMsgs, getMsgById , addMsg, removeMsg, updateMsgs, } from './msg.controller.js'

const router = express.Router()

router.get('/', requireAuth, getMsgs)
router.get('/:msgId', requireAuth, getMsgById)
router.post('/', requireAuth, addMsg)
router.delete('/:msgId', requireAuth, removeMsg)
router.put('/:msgId', requireAuth, updateMsgs)

export const msgRoutes = router