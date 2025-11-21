import { loggerService } from '../../services/logger.service.js'
import { msgService } from './msg.service.js'

export async function getMsgs(req, res) {
    try {
        const msgs = await msgService.query()
        res.send(msgs)
    } catch (err) {
        loggerService.error('Cannot get msgs', err)
        res.status(400).send('Cannot get msgs')
    }
}

export async function addMsg(req, res) {
    const {txt,bugId} = req.body
    const user = req.loginToken._id
    const msgToAdd = {txt,bugId,user}
    try {
        const addedMsg = await msgService.add(msgToAdd)
        res.send(addedMsg)
    } catch (err) {
        loggerService.error('Cannot add msg', err)
        res.status(400).send('Cannot add msg')
    }
}

export async function removeMsg(req, res) {
    if (!req.loginToken.isAdmin) {
        return res.status(403).send('Not authorized')
    }
    const { msgId } = req.params
    try {
        await msgService.remove(msgId)
        res.send('Msg Deleted')
    } catch (err) {
        loggerService.error('Cannot remove msg', err)
        res.status(400).send('Cannot remove msg')
    }
}

export async function updateMsgs(req, res) {
    const { _id, txt } = req.body
    const msgToSave = { _id, txt }
    try {
        const updatedMsg = await msgService.update(msgToSave)
        res.send(updatedMsg)
    } catch (err) {
        loggerService.error('Cannot update msg', err)
        res.status(400).send('Cannot update msg')
    }
}   

export async function getMsgById(req, res) {
    const { msgId } = req.params
    try {
        const msg = await msgService.getById(msgId)
        res.send(msg)
    } catch (err) {
        loggerService.error('Cannot get msg', err)
        res.status(400).send('Cannot get msg')
    }
}

