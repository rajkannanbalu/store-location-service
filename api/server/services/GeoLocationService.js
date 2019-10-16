import axios from 'axios';
const KEY = 'AIzaSyBTcwh9osQr5BJIDhmM8xbau5emg_cQEHI';

class GeoLocationService {

    static async getGeoCodedData(searchQuery) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${KEY}`;
            console.log(url);
        const response = await axios.get(url);        
            if(response.data.status == 'OK') {                
                const geolocation =   response.data.results[0].geometry.location;                              
                return geolocation;
            } else {
                throw new Error("Looks like improper location to geocode");
            }
        } catch(error) {
            throw error;
        }        
    }

    static async findDistance(lat1, lon1, lat2, lon2, unit) {        
            console.log(lat1, lon1, lat2, lon2);
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;                
                if (unit=="km") { dist = dist * 1.609344 }
                if (unit=="mi") { dist = dist * 0.8684 }
                return dist;
            }        
    }
}

export default GeoLocationService;