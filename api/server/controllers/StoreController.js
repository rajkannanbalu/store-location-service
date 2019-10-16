import StoreService from '../services/StoreService';
import Util from '../utils/Utils';
import GeoLocationService from '../services/GeoLocationService';
import _ from 'lodash';

const util = new Util();
const validUnits = ['mi','km']

class StoreController {
  static async getAllStores(req, res) {
    try {
      const allBooks = await StoreService.getAllStores();
      if (allBooks.length > 0) {
        util.setSuccess(200, 'Stores retrieved', allBooks);
      } else {
        util.setSuccess(200, 'No Stores found');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addStore(req, res) {
    if (!req.body.name || !req.body.address || !req.body.location || !req.body.city || !req.body.country || !req.body.state || !req.body.zipcode 
      || !req.body.latitude || !req.body.longitude) {
      util.setError(400, new Error('Please provide complete details about the store'));
      return util.send(res);
    }
    const storeInfo = req.body;

    let pointGeometry = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude],
        crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
    
    let storeToCreate = {
        "name": storeInfo.name,
        "location": storeInfo.location,
        "address": storeInfo.address,
        "city": storeInfo.city,
        "country": storeInfo.country,
        "state": storeInfo.state,
        "zipcode": storeInfo.zipcode,
        "latitude": storeInfo.latitude,
        "longitude": storeInfo.longitude,
        "geom": pointGeometry
    }
      
    try {
      const createdStoreInfo = await StoreService.addStore(storeToCreate);
      util.setSuccess(201, 'Store Added!', createdStoreInfo);
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updateStore(req, res) {
    const store = req.body;
    let pointGeometry = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude],
        crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
        
    let storeToUpdate = {
        "name": store.name,
        "location": store.location,
        "address": store.address,
        "city": store.city,
        "country": store.country,
        "state": store.state,
        "zipcode": store.zipcode,
        "latitude": store.latitude,
        "longitude": store.longitude,
        "geom": pointGeometry
    }
    //TODO check updatedAt only updates to DB  
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, new Error('Please input a valid numeric value'));
      return util.send(res);
    }
    try {
      const updatedStore = await StoreService.updateStore(id, storeToUpdate);
      if (_.isEmpty(updatedStore)) {
        util.setError(404, new Error(`Cannot find store with the id: ${id}`));
      } else {
        util.setSuccess(200, 'Store updated', updatedStore);
      }
      return util.send(res);
    } catch (error) {        
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getNearestStore(req, res) {
    const { zip, address, unit } = req.query;
    let distanceUnit = 'mi' //default

    if(!_.isEmpty(unit) && !validUnits.includes(unit.toLowerCase())) {
      util.setError(400, new Error("Please input valid unit"));
      return util.send(res);
    } 

    if(_.isEmpty(zip) && _.isEmpty(address)) {
      util.setError(400, new Error("Please input  valid zipcode or valid address in the query"));
      return util.send(res);
    }

    if (zip && address) {
      util.setError(400, new Error('Please input either valid zipcode or valid address in the query'));
      return util.send(res);
    }

    //TODO validate zipcode/address format on zip, address field

    const inputLocation = _.isEmpty(zip)?address:zip;
  
    if(!_.isEmpty(unit)) {
      distanceUnit = unit.toLowerCase();
    }

        
    try {
      const geolocation =  await GeoLocationService.getGeoCodedData(inputLocation);      
      const nearestStore = await StoreService.getNearestStore(geolocation);

      if (!nearestStore || _.isEmpty(nearestStore) || nearestStore.length<=0) {
        util.setError(404, new Error(`Cannot find any nearest store`));
      } else {        
        const [storeLng, storeLat] = nearestStore[0].geom.coordinates;
        
        const distance = await GeoLocationService.findDistance(geolocation.lat, geolocation.lng, storeLat, storeLng, distanceUnit);                
        const response = {
          store: nearestStore[0],
          distance: distance.toFixed(2).toString() + distanceUnit 
        }
        util.setSuccess(200, `Found Nearest Store within ${distance.toFixed(2).toString() + distanceUnit }`, response);
      }
      return util.send(res);
    } catch (error) {            
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async deleteStore(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, new Error('Please input a valid numeric value'));
      return util.send(res);
    }

    try {
      const deletedStore = await StoreService.deleteStore(id);
      if(!_.isEmpty(deletedStore)) {
        util.setSuccess(200, `Store with ${id} deleted successfully`, deletedStore)
      } else {
        util.setError(400, new Error(`Store with ${id} does not exists`))
      }
      return util.send(res);
    } catch(error) {
      util.setError(500, error);
      return util.send(res);
    }
  }
    
}

export default StoreController;
