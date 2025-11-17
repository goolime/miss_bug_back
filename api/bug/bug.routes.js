import express from 'express'
import { getBug, getBugs, removeBug, updateBug, addBug } from './bug.controller.js'
import { requireAuth } from '../../midleware/require-auth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.post('/', requireAuth, addBug)
router.put('/:bugId', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, removeBug)

export const bugRoutes = router
