//modules
const 
taskEnums = require('../utils/enums').taskEnums,
    exceptions = require('../utils/exceptions'),
    idGenerator = require('../utils/idgenerator'),
    NodeCache = require('node-cache'),
    Cache = new NodeCache({stdTTL: 60*24, useClenes: false}); // to use as storage

// utils constants
const storageName = 'TASK';

class Task {
    id;
    startupId;
    stageId;
    title;
    status;
    createdAt;
    updatedAt;

    static createId(startupId, stageId ){
        return idGenerator.genId(`${startupId}-${stageId}`) ;
    }

    constructor (startupId, stageId, title, status){
        this.id = Task.createId(startupId, stageId);
        this.startupId = startupId ;
        this.stageId = stageId ;
        this.title = title ;
        this.status = status
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt
    }


    static  #_updateTask(newTask){
        let list = Task.get() ;
        newTask.updatedAt = new Date().toISOString() ;
        
        for (let i = 0; i < list.length; i++) {
            if(list[i].id == newTask.id){
                for (const key in list[i]) {
                    list[i][key] = newTask[key];
                }
            }
        }
        Cache.set(storageName, list);
        return newTask ;
    }

    static async MarkComplete(taskId){
        let task = await Task.getById(taskId) ;
        task.status = taskEnums.status.COMPLETE ;
        return Task.#_updateTask(task);
    }

    static async MarkInComplete(taskId){
        let task = await Task.getById(taskId) ;
        task.status = taskEnums.status.INCOMPLETE ;
        return Task.#_updateTask(task);
    }


    /**
     * for the goal of the test will be simulating data in memory
     * @returns {Array<Task>} when no limit provided
     * @returns {{total: number, limit:number, offset: number, results: Array<Task>}}
     */
    static  get(limit = null, offset = 0){
        let list = Cache.get(storageName) ;
        if(!list && limit != null) return {total : 0, limit, offset, results: []} ;
        if(!list && limit == null) return [] ;

        //startupList = JSON.parse(startupList) ;

        list = list.sort((first, second) => {
            if(first.createdAt > second.createdAt) return -1 ;
            if(first.createdAt < second.createdAt) return 1 ;
            return 0 ;
        }) ;

        if(limit == null) return list ;

        return {total : list.length, limit, offset, results: list.slice(offset*limit, limit)} ;
    }

    static async getByStage(stageId) {
        let list = Cache.get(storageName) ;
        if(!list) return [] ;

        list = list.filter(x => x.stageId == stageId) ;
        list = list.sort((first, second) => {
            if(first.title > second.title) return 1 ;
            if(first.title < second.title) return -1 ;
            return 0 ;
        }) ;

        return  list ;
    }
    /**
     * 
     * @param {*} taskId 
     * @returns{Task} 
     */
    static async getById(taskId){
        let list = Task.get();
        return list.filter(x => {if(x.id == taskId) return x})[0] ;
    }

    /**
     * 
     * @param {*} task
     * @returns{Task}  
     */
    static async save(task) {
        /**
         * TODO: explicity save in DB
         */

        let list = Task.get();

        let exist = list.filter(x => {if(x.id == task.id) return x})[0] ;

        if(exist)
            throw new exceptions.ConflictError('Cant create this task') ;

        //delete progress since is just virtual

        list.push(task);

        Cache.set(storageName, list) ;
        
        return task ;

    }


}

module.exports = Task ;