import { loggerService } from '../services/logger.service.js'

export function log(req, res, next) {
	console.log('Request URL:', req.originalUrl);
    next()
}
