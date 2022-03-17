//modules
const 
    enums = require('../utils/enums'),
    exceptions = require('../utils/exceptions'),
    NodeCache = require('node-cache'),
    Cache = new NodeCache({stdTTL: 60*24, useClenes: false}); // to use as storage

// utils constants
const storageName = 'STAGES';


class Stage {
    id;
    startupId;
    phase; //defining the order of each stage
    title;
    status;
    progress; //virtual only
    createdAt;
    updatedAt

    static createId(startupId, parsedTitle) {
        return `${startupId}-${parsedTitle}` ;
    }

    constructor(startupId, title, phase) {
        let parsedTitle = title.toLowerCase() ;
        parsedTitle = parsedTitle.replace(/ /g,'-');

        this.id = Stage.createId(startupId, parsedTitle);
        this.startupId = startupId ;
        this.title = title ;
        this.phase = phase || this._findNewPhaseNumber();
        this.status = enums.taskEnums.status.INCOMPLETE ;
        
        this.createdAt = new Date().toISOString() ;
        this.updatedAt = this.createdAt ;
    }

    _findNewPhaseNumber(){
        /**
         * TODO: Find out the bigger phase number value
         * by looking in DB sorting des by phase for the 
         * and return the biggest phase+1
         */
    }

    static  get(limit = null, offset = 0){
        let startupList = Cache.get(storageName) ;
        if(!startupList && limit != null) return {total : 0, limit, offset, results: []} ;
        if(!startupList && limit == null) return [] ;


        startupList = startupList.sort((first, second) => {
            if(first.phase > second.phase) return -1 ;
            if(first.phase < second.phase) return 1 ;
            return 0 ;
        }) ;

        if(limit == null) return startupList ;

        return {total : startupList.length, limit, offset, results: startupList.slice(offset*limit, limit)} ;
    }

    static  getByStartup(startupId){
        let list = Cache.get(storageName) ;
        if(!list) return [] ;

        list = list.filter(x => x.startupId == startupId) ;
        list = list.sort((first, second) => {
            if(first.phase > second.phase) return 1 ;
            if(first.phase < second.phase) return -1 ;
            return 0 ;
        }) ;

        return  list ;
    }

    static async getById(stageId){
        let list = Stage.get() ;
        return list.filter(x => {if(x.id == stageId) return x})[0] ;
    }

    static async save(stage) {
        /**
         * TODO: explicity save in DB
         */

        let list = Stage.get();

        let exist = list.filter(x => {
            if(x.id == stage.id) 
                return x
        })[0] ;

        if(exist)
            throw new exceptions.ConflictError('Cant create this stage') ;

        //delete progress since is just virtual
        delete stage.progress ;

        //add the number to auto increment
        if(!stage.phase){
            let startupStages = Stage.getByStartup(stage.startupId) ;
            stage.phase = startupStages[startupStages.length].phase+1 ;
        }

        list.push(stage);


        Cache.set(storageName, list) ;
        
        return stage ;

    }

    static async update(stage) {
        /**
         * TODO: explicity save in DB
         */
        
        stage.updatedAt = new Date().toISOString() ;
        let list = Stage.get();

        for (let i = 0; i < list.length; i++) {
            if(list[i].id == stage.id){
                for (const key in stage) {
                    list[i][key] = stage[key]
                }
            }
        }


        Cache.set(storageName, list) ;
        
        return stage ;

    }

}

module.exports = Stage ;