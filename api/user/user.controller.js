import e from 'express'
import { loggerService } from '../../services/logger.service.js'
import { userService } from './user.service.js'

export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        loggerService.error('Cannot get users', err)
        res.status(400).send('Cannot get users')
    }
}

export async function getUser(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        loggerService.error('Cannot get user', err)
        res.status(400).send('Cannot get user')
    }
}

export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        res.send('User Deleted')
    } catch (err) {
        loggerService.error('Cannot remove user', err)
        res.status(400).send('Cannot remove user')
    }
}

export async function updateUser(req, res) {
    const { _id,  fullname, password, score } = req.body
    const userToSave = { _id, fullname, password, score }

    try {
        const savedUser = await userService.save({ ...await userService.getById(_id), fullname, password, score })
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Cannot save user', err)
        res.status(400).send('Cannot save user')
    }
}

export async function addUser(req, res) {
    const { fullname, username, password } = req.body
    const userToSave = { fullname, username, password, score: 0 }

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Cannot add user', err)
        res.status(400).send('Cannot add user')
    }
}