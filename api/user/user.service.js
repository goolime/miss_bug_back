import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";
import bcrypt from 'bcrypt'


export const userService = {
    query,
    getById,
    remove,
    save,
    login
}

const users = readJsonFile('./data/users.json')


async function query() {

    try {
        return users
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error('Cannot find user')
        return user
    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {

        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx < 0) throw new Error('Cannot find user')
        users.splice(userIdx, 1)
        await _saveusersToFile()
    } catch (err) {
        throw err
    }

}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const userIdx = users.findIndex(user => user._id === userToSave._id)
            if (userIdx < 0) throw new Error('Cannot find user')
            users[userIdx] = userToSave
        } else {
            userToSave._id = makeId()
            userToSave.password = await bcrypt.hash(userToSave.password, 10)
            users.push(userToSave)
        }
        await _saveusersToFile()
        return userToSave
    } catch (err) {
        throw err
    }
}

async function login(username, password) {
    try {
        const user = users.find(user => user.username === username)
        if (!user) throw new Error('Invalid username')
        /*
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Invalid password')
        */
        return user
    } catch (err) {
        throw err
    }
}


function _saveusersToFile() {
    return writeJsonFile('./data/users.json', users)
}