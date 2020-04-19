const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('Should populate req.user with the payload of a valid JWT', () => {
        const user = {_id:mongoose.Types.ObjectId().toHexString(), isAdmin:true}
        const token = new User(user).generateAuthToken();
        const req = {
            // reuest object needs a header method to return token. Use mock
            header: jest.fn().mockReturnValue(token)
        };

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
})