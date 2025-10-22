import  * as db from './store.db.js'

export default class Store{

    static async getGamesStore(){
              return await db.getGamesStore();
          }
      
          static async getGameById(id){
              return await db.getGameById(id);
          }
            
    static async searchGameByName(name){
        return await db.searchGameByName(name);
    }
    static async getGameStorePage(id){
        return await db.getGameStorePage(id);
    }

    static async getGameRequirements(id){
        return await db.getGameRequirementsById(id)
    }

    static async getHardwareDb(){
        return await db.getHardwareDb()
    }

    static async saveGameBenchmarkVerdict(gameId,hardware,verdict){
        return await db.saveGameBenchmarkVerdict(gameId,hardware,verdict)
    }
}