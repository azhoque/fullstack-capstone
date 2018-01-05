const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Ontrack', function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    }); 

    it('should list projects on GET', function(){
        return chai.request(app)
        .get('/projects')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.length.be.at.least(1);
            const expectedKeys = ["id", "date", "project", "pm", "recentStatus", "share"];
            res.body.forEach(item => {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
            });
        });
    });

    it('should add projects on POST', function(){
        const newItem = {
            date: "1/1/2018",
            project:"Project X",
            pm:"Foo",
            recentStatus:"meep",
            share:"foo@bar.com"
        };
        return chai.request(app)
        .post('/projects')
        .send(newItem)
        .then(function(res){
            res.should.have.status(201);
            res.should.be.a.json;
            res.should.be.a('object');
            res.body.should.include.keys("id", "date", "project", "pm", "recentStatus", "share");
            res.body.should.not.be.null;
            res.body.should.deep.equal.(Object.assign(newItem, {id: res.body.if}));
        });
    });
    it("should update item on PUT", function() {
        const updateData = {
            date: "1/2/2018",
            recentStatus:"meep meep meep",
            share:"bar@foo.com"
        };
        return chai.request(app)
        .get('/projects')
        .then(function(res) {
        updateData.id = res.body[0].id;
    
          return chai.request(app)
            .put(`/projects/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res) {
          res.should.have.status(204);
        });
    });
    
    it("should delete items on DELETE", function() {
        return chai.request(app)
          .get("/projects")
          .then(function(res) {
            return chai.request(app).delete(`/projects/${res.body[0].id}`);
          })
          .then(function(res) {
            res.should.have.status(204);
        });
});