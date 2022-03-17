const 
    Task = require('../models/task'),
    exceptions = require('../utils/exceptions'),
    enums = require('../utils/enums'),
    StageService = require('./stage_services');


exports.create = async (startup, stage, taskReq) => {
    let task = new Task(startup.id, stage.id, taskReq.title, enums.taskEnums.status.INCOMPLETE) ;
    let result = await Task.save(task) ;

    //run async
    StageService.rectifyStatus(stage.id).catch(err=>{console.error(err)});

    return result ;
}

exports.getListByStage = async(stage, limit, offset) => {
    let result = await Task.getByStage(stage.id )
    return result ;
}

exports.completeTask = async (stage, taskId) => {
    let canComplete = await StageService.canCompleteTask(stage.id) ;
    if(!canComplete)
        throw new exceptions.BadRequestError('this task can not be completed. please complete all tasks of previous stage to continue');
    
    await Task.MarkComplete(taskId) ;

    //run async
    StageService.rectifyStatus(stage.id) ;

    return ;
}



