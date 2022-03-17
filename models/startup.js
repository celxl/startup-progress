//modules
const 
    enums = require('../utils/enums'),
    idGenerator = require('../utils/idgenerator'), //just to simulate id creations since just using in memory save
    exceptions = require('../utils/exceptions'),
    NodeCache = require('node-cache'),
    Cache = new NodeCache({stdTTL: 60*24, useClenes: false}); // to use as storage

// utils constants
const 
    excludedForCreation = [
        'id',
        'progress',
        'status',
        'deleted'
    ],
    storageName = 'STARTUP';

class StartUP {
    id;
    name = null; 
    businessName = null ;
    visionMission = null ;
    virtualOffice = null ;
    description = null ;
    progress;  // number representing the percentage base in the stage and task completed - virtual
    domain = null ;
    createdAt;
    status = enums.startupEnums.status.IDEA; //string representing the stage the start up is at the moment
    updatedAt;
    deleted = false;

    constructor(startup = {}){
        for (const key in startup) {
            if(key in this && !excludedForCreation.includes(key)){
                this[key] = startup[key]
            }
        }
        this.id = idGenerator.genId('SUP')
        this.createdAt = new Date().toISOString() ;
        this.updatedAt = this.createdAt ;
    }

   
    //methods 
    /**
     * for the goal of the test will be simulating data in memory
     * @returns {Array<StartUP>} when no limit provided
     * @returns {{total: number, limit:number, offset: number, results: Array<StartUP>}}
     */
    static  get(limit = null, offset = 0){
        let startupList = Cache.get(storageName) ;
        if(!startupList && limit != null) return {total : 0, limit, offset, results: []} ;
        if(!startupList && limit == null) return [] ;

        //startupList = JSON.parse(startupList) ;

        startupList = startupList.sort((first, second) => {
            if(first.createdAt > second.createdAt) return -1 ;
            if(first.createdAt < second.createdAt) return 1 ;
            return 0 ;
        }) ;

        if(limit == null) return startupList ;

        return {total : startupList.length, limit, offset, results: startupList.slice(offset*limit, limit)} ;
    }

    /**
     * 
     * @param {*} startupId 
     * @returns{StartUP} startup
     */
    static async getById(startupId){
        let list = StartUP.get();
        return list.filter(x => {if(x.id == startupId) return x})[0] ;
    }

    /**
     * 
     * @param {*} startup
     * @returns{StartUP} startup 
     */
    static async save(startup) {
        /**
         * TODO: explicity save in DB
         */

        let startUpList = StartUP.get();

        let exist = startUpList.filter(x => {if(x.id == startup.id) return x})[0] ;

        if(exist)
            throw new exceptions.ConflictError('Cant create this startup') ;

        //delete progress since is just virtual
        delete startup.progress ;

        startUpList.push(startup);

        Cache.set(storageName, startUpList) ;
        
        return startup ;

    }

    /**
     * 
     * @param {*} startupId 
     * @param {StartUP} startup 
     * @param {boolean} returnOld when true also return the old obj
     * @returns {{new: StartUP, old: StartUP || null}}
     */
    static async update(startupId , startup, returnOld = false) {
        startup.updatedAt = new Date().toISOString()
        /**
         * TODO: explicity update in DB
         */
    }
    /**
     * 
     * @param {*} startupId 
     * @returns {StartUP}
     */
    static async softDelete(startupId) {
        let startup = await StartUP.get(startupId) ;
        startup.deleted = true ;
        return (await StartUP.update(startupId, startup)).new ;
    }

    /**
     * 
     * @param {*} startupId 
     * @returns {StartUP}
     */
    static async Delete(startupId) {
        /**
         * TODO: explicity delete from DB
         */
    }
}

module.exports = StartUP ;