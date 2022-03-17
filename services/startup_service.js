const 
    StartUP = require('../models/startup'),
    exceptions = require('../utils/exceptions'),
    StageService = require('./stage_services');


exports.create = async(startupReq) => {
    let startup = new StartUP(startupReq) ;
    let result = await StartUP.save(startup) ;
    await StageService.createBuildIn(result) ;
    return result ;
};

exports.update = async (startupId , startupReq) => {
    /**
     * TODO: update by startup update
     */
    return
}

exports.getList = async (limit = 20, offset = 0) => {
    let result = await StartUP.get(limit, offset) ;
    return result ;
}; 

exports.getById = async (startupId, stages = false, tasks = false) => {
    let result =  await StartUP.getById(startupId) ;
    if(!result) 
        throw new exceptions.NotFoundError('not found');

    if(stages){
        console.log('including stages')
        result.stages = await StageService.getList(result.id, tasks) ;
    }
    
    result.progress = _calculateProgress(result) ;

    return result ;
}
function _calculateProgress(startup){
    /**
     * TODO: run db query to get total of compted task and total tasks of the stage
     * then return the percentage that completed represent
     */
    return 'Calculating...'
}