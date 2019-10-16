import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testing the Store API endpoints:', () => {
  
  

  it('It should add a new store', (done) => {    
    let storeToCreate = getStoreInfo();
    chai.request(app)
      .post('/v1/closest')
      .set('Accept', 'application/json')
      .send(storeToCreate)
      .end((err, res) => {
        expect(res.status).to.equal(201);        
        expect(res.body.message).to.equal('Store Added!');
        expect(res.body.data.id).to.greaterThan(1);
        expect(res.body.data.name).equal(storeToCreate.name);
        expect(res.body.data.location).equal(storeToCreate.location);
        expect(res.body.data.address).equal(storeToCreate.address);
        expect(res.body.data.city).equal(storeToCreate.city);
        expect(res.body.data.country).equal(storeToCreate.country);
        expect(res.body.data.latitude).equal(storeToCreate.latitude);
        expect(res.body.data.longitude).equal(storeToCreate.longitude);
        done();
      });
  });

  it('It should not new store with empty data', (done) => {    
    let storeToCreate = {};
    chai.request(app)
      .post('/v1/closest')
      .set('Accept', 'application/json')
      .send(storeToCreate)
      .end((err, res) => {
        expect(res.status).to.equal(400);        
        expect(res.body.message).to.equal('Please provide complete details about the store');        
        done();
      });
  });

  it('It should get all stores', (done) => {
    chai.request(app)
      .get('/v1/closest/all')
      .set('Accept', 'application/json')
      .end((err, res) => {                
        expect(res.body.data.length).to.greaterThan(0);
        res.body.data[0].should.have.property('name');
        res.body.data[0].should.have.property('location');
        res.body.data[0].should.have.property('geom');
        res.body.data[0].should.have.property('country');
        res.body.data[0].should.have.property('address');
        res.body.data[0].should.have.property('city');
        res.body.data[0].should.have.property('state');        
        done();
      });
  });

  it('It should not new store with few fields missing in input store data', (done) => {    
    let storeToCreate = {
      name: "test"
    };
    chai.request(app)
      .post('/v1/closest')
      .set('Accept', 'application/json')
      .send(storeToCreate)
      .end((err, res) => {
        expect(res.status).to.equal(400);        
        expect(res.body.message).to.equal('Please provide complete details about the store');        
        done();
      });
  });

  it('It should update a store with latest info', (done) => {
    const storeId = 1;
    let storeToUpdate = getStoreInfo();
    chai.request(app)
      .put(`/v1/closest/${storeId}`)
      .set('Accept', 'application/json')
      .send(storeToUpdate)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Store updated");
        expect(res.body.data.name).equal(storeToUpdate.name);
        expect(res.body.data.location).equal(storeToUpdate.location);
        expect(res.body.data.address).equal(storeToUpdate.address);
        expect(res.body.data.city).equal(storeToUpdate.city);
        expect(res.body.data.country).equal(storeToUpdate.country);
        expect(res.body.data.latitude).equal(storeToUpdate.latitude);
        expect(res.body.data.longitude).equal(storeToUpdate.longitude);
        done();
      });
  });

  it('It should not update a store with invalid store id', (done) => {
    const storeId = 112121;
    let storeToUpdate = getStoreInfo();
    chai.request(app)
      .put(`/v1/closest/${storeId}`)
      .set('Accept', 'application/json')
      .send(storeToUpdate)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message').eql(`Cannot find store with the id: ${storeId}`);
        done();
      });
  });

  it('It should not update a store with non-numeric store id value', (done) => {
    const storeId = "12w11dadss";
    let storeToUpdate = getStoreInfo();
    chai.request(app)
      .put(`/v1/closest/${storeId}`)
      .set('Accept', 'application/json')
      .send(storeToUpdate)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message').eql(`Please input a valid numeric value`);
        done();
      });
  });

  it("It Should return nearest store with given zip code and unit as km", (done) => {
    const zipCode = '55428-3507'
    chai.request(app)
      .get(`/v1/closest?zip=${zipCode}&unit=km`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.contains("Found Nearest Store within");
        res.body.data.store.should.have.property('name');
        res.body.data.store.should.have.property('location');
        res.body.data.store.should.have.property('geom');
        res.body.data.store.should.have.property('country');
        res.body.data.store.should.have.property('address');
        res.body.data.store.should.have.property('city');
        res.body.data.store.should.have.property('state');
        res.body.data.should.have.property('distance');        
        done();
      });
  });

  it("It Should return nearest store with given address and unit as mi", (done) => {
    const address = '5537 W Broadway Ave'
    chai.request(app)
      .get(`/v1/closest?address=${address}&unit=mi`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.contains("Found Nearest Store within");
        res.body.data.store.should.have.property('name');
        res.body.data.store.should.have.property('location');
        res.body.data.store.should.have.property('geom');
        res.body.data.store.should.have.property('country');
        res.body.data.store.should.have.property('address');
        res.body.data.store.should.have.property('city');
        res.body.data.store.should.have.property('state');
        res.body.data.should.have.property('distance');        
        done();
      });
  });

  it("It Should return bad request with given zip code and address and unit as km", (done) => {
    const address = '5537 W Broadway Ave'
    const zipCode = '55428-3507'
    chai.request(app)
      .get(`/v1/closest?address=${address}&zip=${zipCode}&unit=mi`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Please input either valid zipcode or valid address in the query");              
        done();
      });
  });

  it("It Should return bad request with given zip code and address and invalid unit", (done) => {
    const address = '5537 W Broadway Ave'    
    chai.request(app)
      .get(`/v1/closest?address=${address}&unit=kim`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Please input valid unit");              
        done();
      });
  });

  it("It Should return nearest store with no query parameters", (done) => {
    chai.request(app)
      .get(`/v1/closest`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Please input  valid zipcode or valid address in the query");              
        done();
      });
  });

  it("It Should return error with invalid zip code", (done) => {
    const zipCode = '121212'
    chai.request(app)
      .get(`/v1/closest?zip=${zipCode}&unit=mi`)
      .set('Accept', 'application/json')      
      .end((err, res) => {
        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal("Looks like improper location to geocode");          
        done();
      });
  });

  it("It should delete the store with given valid id", (done) => {
    const storeId = 1;
    chai.request(app)
    .delete(`/v1/closest/${storeId}`)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`Store with ${storeId} deleted successfully`)    
      done();
    })
  });

  it("It should delete the store with given valid id", (done) => {
    const storeId = 2000;
    chai.request(app)
    .delete(`/v1/closest/${storeId}`)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(`Store with ${storeId} does not exists`)    
      done();
    })
  });

  it("It should delete the store with given valid id", (done) => {
    const storeId = "!212";
    chai.request(app)
    .delete(`/v1/closest/${storeId}`)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(`Please input a valid numeric value`)    
      done();
    })
  });


  function getStoreInfo() {
    return {
      "name": "test_store",
      "location": "test_location",
      "address": "address",
      "city": "city",
      "country": "US",
      "state": "SL",
      "zipcode": "121",
      "latitude": 41.5996579,
      "longitude": -93.7132916
    }
  }
  
});
