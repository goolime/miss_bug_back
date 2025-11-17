import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

const PAGE_SIZE = 6

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = readJsonFile('./data/bugs.json')


async function query(filterBy = {}) {
    const { txt = '', minSeverity = 0, labels = [], pageIdx = 0, sortBy = 'txt', orderBy = -1, owner = null } = filterBy
    const maxPage= Math.ceil(bugs.length / PAGE_SIZE)
    const validPageIdx = (pageIdx >=0 && pageIdx < maxPage) ? pageIdx : 0
    const startIdx = validPageIdx * PAGE_SIZE
    const endIdx = startIdx + PAGE_SIZE

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

    try {
        return [filteredBugs.slice(startIdx, endIdx), Math.ceil(filteredBugs.length / PAGE_SIZE)]
    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error('Cannot find bug')
        return bug
    } catch (err) {
        throw err
    }
}

async function remove(bugId, user) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx < 0) throw new Error('Cannot find bug')
        if (!_isOwner(bugs[bugIdx], user)) throw new Error('Not your bug')
        bugs.splice(bugIdx, 1)
        await _savebugsToFile()
    } catch (err) {
        throw err
    }

}

async function save(bugToSave,user=null) {
    try {
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx < 0) throw new Error('Cannot find bug')
            if (!_isOwner(bugs[bugIdx], user)) throw new Error('Not your bug')
            bugs[bugIdx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        await _savebugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
}


function _savebugsToFile() {
    return writeJsonFile('./data/bugs.json', bugs)
}

function _isOwner(bug, user) {
    return user.isAdmin || bug.creator._id === user._id
}