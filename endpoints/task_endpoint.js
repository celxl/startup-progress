//node modules & libraries
const
    express = require('express'),
    router = express.Router();

//custom services & utils
const 
    TaskService = require('../services/task_service'),
    Middleware = require('../middlewares/custom_middelware');

//others 
const baseUrl = `/startup/:startupId/stage/:stageId/task`;

/**
 * List all tasks of a stage
 */
router.get('/', Middleware.taskRoutes, async (req, res, next) => {
    try {
        const
            startup = req.startup,
            stage = req.stage,
            limit = (req.query.limit && !(!parseInt(req.query.limit))) ? parseInt(req.query.limit) : 20,
            offset = (req.query.offset && !(!parseInt(req.query.offset))) ? parseInt(req.query.offset) : 0;
        
        let result = await TaskService.getListByStage(stage, limit, offset) ;

        res.status(200).json(result) ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
});

/**
 * Create new task for a stage
 */
router.post('/', Middleware.taskRoutes, async (req, res, next) => {
    try {
        const
            startup = req.startup,
            stage = req.stage;
        
        let result = await TaskService.create(startup, stage, req.body) ;

        res.status(200).json(result);
    } catch (error) {
        if(error.Status)
        res.status(error.Status).json(error)
    else
        res.sendStatus(500)
    }
});

/**
 * Update a task of a stage
 */
router.put('/:taskId/complete-task', Middleware.taskRoutes, async (req, res, next) => {
    try {
        const 
            startup = req.startup,
            stage = req.stage;

        await TaskService.completeTask(stage, req.params.taskId) ;

        res.sendStatus(200) ;
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