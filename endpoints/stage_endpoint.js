//node modules & libraries
const
    express = require('express'),
    router = express.Router();

//custom services & utils
const 
    StageService = require('../services/stage_services'),
    Middleware = require('../middlewares/custom_middelware');

//others 
const baseUrl = `/startup/:startupId/stage`;

/**
 * List all startup's stages
 */
router.get('/', Middleware.stageRoutes, async (req, res, next) => {
    try {
        const
            startup = req.startup,
            limit = (req.query.limit && !(!parseInt(req.query.limit))) ? parseInt(req.query.limit) : 20,
            offset = (req.query.offset && !(!parseInt(req.query.offset))) ? parseInt(req.query.offset) : 0;
        
        let result = await StageService.getList(startup, limit, offset) ;

        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

/**
 * Create new stage for startup
 */
router.post('/', Middleware.taskRoutes, async (req, res, next) => {
    try {
        const startup = req.startup ;
        
        let result = await StageService.createCustom(startup, req.body) ;

        res.status(200).json(result);
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

/**
 * Update an stage
 */
router.put('/:stageId', Middleware.taskRoutes, async (req, res, next) => {
    try {
        const
            startup = req.startup ;

        let result = await StageService.update(startup, req.params.stageId, req.body) ;

        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
})

module.exports = {
    baseUrl,
    router
};