const {User} = require('../../../models/user.js')
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    beforeEach( () => { server = require('../../../index') });
    afterEach( async () => {
        //console.log('start close server user');
        await server.close(); 
        //console.log('end close server user');
    } )

    it('should return a valid jwt', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString()
           ,isAdmin: true  
        };

        const user = new User(payload);

        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payload);
    })
})

