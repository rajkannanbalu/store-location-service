import database from '../src/models';

class StoreService {
  static async getAllStores() {
    try {
      return await database.locations.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addStore(store) {
    try {
      return await database.locations.create(store);
    } catch (error) {
      throw error;
    }
  }

  static async updateStore(id, store) {
    try {
      const storeToUpdate = await database.locations.findOne({
        where: { id: Number(id) }
      });

      if (storeToUpdate) {
        await database.locations.update(store, { where: { id: Number(id) } });

        return store;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getNearestStore(point) {
    try {        
        const location = point.lng + ' ' + point.lat;        
        const query = {
          type: database.sequelize.QueryTypes.SELECT,
          order: [
             database.sequelize.fn('ST_Distance', 
             database.sequelize.literal('geom'),
             database.sequelize.literal('\'SRID=4326;POINT('+location+')\'')
             )             
          ],
          limit: 1       
        }                                 
        const store = await database.locations.findAll(query);        

      return store;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteStore(id) {
    try {
      const storeToDelete = await database.locations.findOne({ where: { id: Number(id) } });

      if (storeToDelete) {
        const deletedStore = await database.locations.destroy({
          where: { id: Number(id) }
        });
        if(deletedStore) {
          return storeToDelete;
        }        
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default StoreService;
