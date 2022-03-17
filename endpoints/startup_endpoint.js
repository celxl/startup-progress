//node modules & libraries
const
    express = require('express'),
    router = express.Router();

//custom services & utils
const StartUPService = require('../services/startup_service') ;

//others 
const baseUrl = `/startup`;

/**
 * List all startups
 */
router.get('/', async (req, res, next) => {
    try {
        const
            limit = (req.query.limit && !(!parseInt(req.query.limit))) ? parseInt(req.query.limit) : 20,
            offset = (req.query.offset && !(!parseInt(req.query.offset))) ? parseInt(req.query.offset) : 0;

        let result = await StartUPService.getList(limit, offset) ;

        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

/**
 * Get startup by id,
 * in q params can be asked to include stages and stages' tasks
 */
router.get('/:startupId', async (req, res, next) => {
    try {
        const 
            stages = (req.query.stages == 'yes')? true : false,
            tasks = (req.query.tasks == 'yes')? true : false;

        let result = await StartUPService.getById(req.params.startupId, stages, tasks) ;
        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

/**
 * Create a new startup
 */
router.post('/', async (req, res, next) => {
    try {
        let result = await StartUPService.create(req.body) ;
        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
})

/**
 * Update a startup
 */
router.put('/:startupId', async (req, res, next) => {
    try {
        let result = await StartUPService.update(req.params.startupId, req.body) ;
        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

module.exports = {
    baseUrl,
    router
};