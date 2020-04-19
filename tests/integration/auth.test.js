const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');

describe('auth middleware', ()=> {
    beforeEach( () => { server = require('../../index') });
    afterEach( async () => {
        //console.log('start close server auth');
        await Genre.remove({});
        await server.close(); 
        //console.log('end close server auth');
    } )

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres/')
            .set('x-auth-token',token)
            .send({name: 'genre 2'});
    }

    beforeEach( () => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';  
        const res = await exec();
        expect(res.status).toBe(401);
    });
}) ;