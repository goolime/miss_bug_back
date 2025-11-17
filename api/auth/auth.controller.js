import e from 'express'
import { loggerService } from '../../services/logger.service.js'
import { userService } from '../user/user.service.js'
import { authService } from './auth.service.js'

export async function addUser(req, res) {
    const { fullname, username, password } = req.body
    if (!fullname || !username || !password) {
        res.status(400).send('fullname, username and password are required!')
        return
    }
    const userToSave = { fullname, username, password, score: 0 }

    try {
        const savedUser = await userService.save(userToSave)
        loggerService.info(`User added: ${savedUser._id}`)

        const user = await userService.login(savedUser._id)
        loggerService.info('User login:', user)
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })

        res.json(savedUser)
    } catch (err) {
        loggerService.error('Cannot add user', err)
        res.status(400).send('Cannot add user')
    }
}

export async function loginUser(req, res) {
    const { username, password } = req.body
    if (!username) {
        res.status(400).send('username and password are required!')
        return
    }
    try {
        const user = await userService.login(username, password)
        loggerService.info('User login: ', user)
        
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        loggerService.error('Cannot login user', err)
        res.status(400).send('Cannot login user')
    }
}

export async function logoutUser(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        loggerService.error('Cannot logout user', err)
        res.status(400).send('Cannot logout user')
    }
}