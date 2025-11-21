import e from 'express'
import { loggerService } from '../../services/logger.service.js'
import { bugService } from './bug.service.js'

export async function getBugs(req, res) {
    const { txt, minSeverity, labels, pageIdx, sortBy, orderBy, owner } = req.query
    const filterBy = {
        txt,
        minSeverity: +minSeverity,
        labels: labels ? labels : [],
        pageIdx: (pageIdx && +pageIdx>-1) ? +pageIdx : 0,
        sortBy: sortBy ? sortBy : 'txt',
        orderBy: orderBy ? orderBy : -1,
        owner: owner ? owner : null
    }

    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get bugs')
    }
}

export async function getBug(req, res) {
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error('Cannot get bug', err)
        res.status(400).send('Cannot get bug')
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
    try {
        const user = req.loggedinUser
        await bugService.remove(bugId, user)
        res.send('Bug Deleted')
    } catch (err) {
        loggerService.error('Cannot remove bug', err)
        res.status(400).send('Cannot remove bug')
    }
}

export async function updateBug(req, res) {
    const { _id, title, severity, createdAt , labels, creator } = req.body
    const bugToSave = { _id, title, severity, createdAt , labels, creator }
    try {
        const savedBug = await bugService.save(bugToSave, req.loginToken)
        res.send(savedBug)
    } catch (err) {
        loggerService.error('Cannot save bug', err)
        res.status(400).send('Cannot save bug')
    }
}

export async function addBug(req, res) {
    const { title, severity, createdAt , labels } = req.body
    const bugToSave = { title, severity, createdAt , labels }

    try {
        const savedBug = await bugService.save(bugToSave, req.loginToken)
        res.send(savedBug)
    } catch (err) {
        loggerService.error('Cannot add bug', err)
        res.status(400).send('Cannot add bug')
    }
}