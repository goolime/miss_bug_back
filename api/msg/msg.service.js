import { ObjectId } from 'mongodb'
import { dbService } from "../../services/db.service.js";


const PAGE_SIZE = 6
const COLLECTION_NAME = 'missBugs_msgs'

export const msgService = {
    query,
    getById,
    remove,
    add,
    update
}

async function query(filterBy = {}) {
    const criteria = {}
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME) 
        const msgs = await collection.find(criteria).toArray()
        return msgs
    } catch (err) {
        throw err
    }
}

async function getById(msgId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria = { _id: ObjectId.createFromHexString(msgId) }
        const msg = await collection.findOne(criteria)
        return msg
    } catch (err) { 
        throw err
    }
}
async function remove(msgId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria = { _id: ObjectId.createFromHexString(msgId) }
        await collection.deleteOne(criteria)
        return msgId
    } catch (err) {
        throw err
    }   
}

async function add(msgToAdd) {  
    try {

        const {txt,bugId,user} = msgToAdd
        msg= {
            txt,
            "aboutBugId": ObjectId.createFromHexString(bugId),
            "byUserId": ObjectId.createFromHexString(user),
        }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const res = await collection.insertOne(msg)
        msg._id = res.insertedId
        return msg
    } catch (err) {
        throw err
    }
}

async function update(msgToSave) {  
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria = { _id: ObjectId.createFromHexString(msgToSave._id) }
        const res = await collection.replaceOne(criteria, { $set: msgToSave })
        if (res.modifiedCount === 0) throw new Error('Cannot update msg')
        return msgToSave
    } catch (err) {
        throw err
    }
}

