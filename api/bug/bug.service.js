import { ObjectId } from 'mongodb'

//import { loggerService } from "../../services/logger.service.js";
//import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";
import { dbService } from "../../services/db.service.js";


const PAGE_SIZE = 6
const COLLECTION_NAME = 'missBugs_bugs'

export const bugService = {
    query,
    getById,
    remove,
    save
}

//const bugs = readJsonFile('./data/bugs.json')


async function query(filterBy = {}) {
    const { txt = '', minSeverity = 0, labels = [], pageIdx = 0, sortBy = 'txt', orderBy = -1, owner = null } = filterBy
    //const maxPage= Math.ceil(bugs.length / PAGE_SIZE)
    const validPageIdx = (pageIdx >=0) ? pageIdx : 0
    //const startIdx = validPageIdx * PAGE_SIZE
    //const endIdx = startIdx + PAGE_SIZE

    try {
        const criteria = _buildCriteria(txt, minSeverity, labels, owner)
        const sort=_buildSort(sortBy, orderBy)
        
        console.log('criteria:', criteria, 'sort:', sort)
        
        const collection = await dbService.getCollection(COLLECTION_NAME) 
        var filteredBugs = await collection.find(criteria,{sort})
        const totalCount = await filteredBugs.count()

        filteredBugs.skip(validPageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        
        
        return [await filteredBugs.toArray(), Math.ceil(totalCount / PAGE_SIZE)]

    /*
    const filteredBugs = bugs.filter(bug => {
        loggerService.debug('Filtering bugs with', filterBy)
        loggerService.debug('bug:', bug)
        return (
            bug.title.includes(txt) &&
            bug.severity >= minSeverity &&
            (labels.length === 0 || labels.every(label => bug.labels.includes(label))) &&
            bug.creator._id === (owner ? owner : bug.creator._id)
        )
    }).sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        return (aVal < bVal ? -1 : 1) * orderBy
    })
    return [filteredBugs.slice(startIdx, endIdx), Math.ceil(filteredBugs.length / PAGE_SIZE)]
    */
    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const bug = await collection.findOne(criteria)

        return bug
        /*
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error('Cannot find bug')
        return bug
        */
    } catch (err) {
        throw err
    }
}

async function remove(bugId, user) {
    try {
        criteria = { _id: ObjectId.createFromHexString(bugId) }
        if (!user.isAdmin) {
            criteria.creatorId = user._id
        }

        const collection = await dbService.getCollection(COLLECTION_NAME)
        const res = await collection.deleteOne(criteria)
        if (res.deletedCount === 0) throw new Error('Cannot delete bug')

        return bugId

        /*
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx < 0) throw new Error('Cannot find bug')
        if (!_isOwner(bugs[bugIdx], user)) throw new Error('Not your bug')
        bugs.splice(bugIdx, 1)
        await _savebugsToFile()
        */
    } catch (err) {
        throw err
    }

}

async function save(bugToSave,user=null) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        if (bugToSave._id) {
            
            const criteria = { _id: ObjectId.createFromHexString(bugToSave._id) }
            if (!user.isAdmin) {
                criteria.creatorId = user._id
            }
            const res = await collection.replaceOne(criteria, { $set: bugToSave })
            if (res.modifiedCount === 0) throw new Error('Cannot update bug')
            /*
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx < 0) throw new Error('Cannot find bug')
            if (!_isOwner(bugs[bugIdx], user)) throw new Error('Not your bug')
            bugs[bugIdx] = bugToSave
            */
        } else {
            bugToSave.creator={_id: user._id, fullname: user.fullname}
            bugToSave.createdAt = Date.now()
            console.log('bugToSave:',bugToSave)
            const returnid= (await collection.insertOne(bugToSave)).insertedId
            /*
            bugToSave._id = makeId()
            bugs.push(bugToSave)
            */
            bugToSave._id = returnid
            console.log('bugToSave after insert:', bugToSave)
        }
        //await _savebugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
}

function _buildCriteria(txt, minSeverity, labels, owner) {
    const criteria = {
        severity: { $gte: minSeverity }
    }
    if (txt) criteria.title = { $regex: txt, $options: 'i' }
    if (labels.length) criteria.labels = { $all: labels }
    if (owner) criteria['creator._id'] = ObjectId.createFromHexString(owner)
    return criteria
}

function _buildSort(sortBy, orderBy) {
    const sort = {}
    sort[sortBy] = orderBy
    return sort
}