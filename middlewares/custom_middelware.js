const
    StartupServices = require('../services/startup_service'),
    StageService = require('../services/stage_services');

exports.taskRoutes = async (req, res, next) => {
    try {
        req.startup = await StartupServices.getById(req.startupId) ;
        
        req.stage = await StageService.getById(req.stageId) ;

        next() ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
}

exports.stageRoutes = async (req, res, next) => {
    try {
        req.startup = await StartupServices.getById(req.startupId) ;
        
        next() ;
    } catch (error) {
        if(error.Status)
            res.status(error.Status).json(error)
        else
            res.sendStatus(500)
    }
}