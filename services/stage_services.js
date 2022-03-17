const { taskEnums } = require('../utils/enums');

const 
    Stage = require('../models/stage'),
    exceptions = require('../utils/exceptions'),
    TaskService = require('./task_service'),
    stageEnums = require('../utils/enums').stageEnums;

//create know default stages
exports.createBuildIn = async(startup) => {
    let defaultStages = {
        Foundation : new Stage(startup.id, stageEnums.type.FOUNDATION, 1),
        Discovery  : new Stage(startup.id, stageEnums.type.DISCOVERY, 2 ),
        Delivery   : new Stage(startup.id, stageEnums.type.DELIVERY, 3 )
    } ;
    
    for (const key in defaultStages) {
        let stage = await Stage.save(defaultStages[key]) ;
    }

};

//create custom stage
exports.createCustom = async(startup, stageReq) => {
   let stage = new Stage(startup.id, stageReq.title, stageReq.phase);
   let result = await Stage.save(stage) ;
   return result ;
};

exports.update = async (stageId, stageReq) => {
    /**
     * TODO: update an stage by stageId
     */
    return;
}

exports.getList = async (startupId, tasks = false) => {
    let result = await Stage.getByStartup(startupId) ;

    if (tasks){
        for (let i = 0; i < result.length; i++) {
            result[i].tasks = await TaskService.getListByStage(result[i]) ;
            result[i].progress = _calculateProgress(result[i]) ;
        }
    }
    return result ;
}; 

exports.getById = async (stageId) => {
    let result = await Stage.getById(stageId);
    if(!result)
        throw new exceptions.NotFoundError('not found') ;

    result.progress = _calculateProgress(result) ;
    return result ;
}

exports.canCompleteTask = async(stageId) => {
    let stage = await exports.getById(stageId) ;
    if(stage.phase == 1) return true ;

    let list = await exports.getList(stage.startupId) ;
    let previousStage = list.filter(x => x.phase == (stage.phase - 1))[0] ;
    
    return previousStage.status == taskEnums.status.COMPLETE ;
}

exports.rectifyStatus = async (stageId) => {
    let stage = await exports.getById(stageId) ; 
    let tasks = await TaskService.getListByStage(stage) ;
    let pendingTasks = tasks.filter(x => x.status == taskEnums.status.INCOMPLETE);
    let updateRequired = false ;

    /**
     * there are pending tasks in this stage
     * and
     * the stage status is not incomplete
     * then
     * update
     */
    if(pendingTasks.length > 0 && stage.status != taskEnums.status.INCOMPLETE) {
        stage.status = taskEnums.status.INCOMPLETE ;
        updateRequired = true;
    }

    /**
     * there aren't pending tasks in this stage
     * and
     * the stage status is not complete
     * then
     * update
     */
    if(pendingTasks.length == 0 && stage.status != taskEnums.status.COMPLETE) {
        stage.status = taskEnums.status.COMPLETE ;
        updateRequired = true;
    }

    //above conditions are to avoid querying and writing in if there is no need to change 
    //current status
    if(updateRequired){
        await Stage.update(stage) ;
    }

}


function _calculateProgress(stage){
    /**
     * TODO: run db query to get total of compted task and total tasks of the stage
     * then return the percentage that completed represent
     */
    return 'Calculating...'
}