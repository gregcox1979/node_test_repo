const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => { 
    beforeEach( () => { 
        server = require('../../index') 
    });
    afterEach( async () => {    
        await Genre.remove(); 
        await User.remove();
        //console.log('start close server genre');
        await server.close(); 
        //console.log('end close server genre');
    } )
    
    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' }
               ,{ name: 'genre2' } 
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('Should return genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre 1' });
            await genre.save(); 

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    
        it('Should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + 1);
            expect(res.status).toBe(404);
        });

        it('Should return 404 if genre not found from given id', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404); 
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre 1';
        })

        it('should return 401 if client is not logged in' , async () => {
            // const res = await request(server)
            //     .post('/api/genres')
            //     .send({ name: 'genre1' });
            // REPLACED WITH
            token = '';    
            const res = await exec();
            expect(res.status).toBe(401);
        });
    
        it('should return 400 if genre is less than 5 characters' , async () => {
            
            // const res = await request(server)
            // .post('/api/genres')
            // .set('x-auth-token', token)
            // .send({ name: '1234' });
            // REPLACED WITH
            name ='1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters' , async () => {

            name = new Array(52).join('a');
            // const res = await request(server)
            // .post('/api/genres')
            // .set('x-auth-token', token)
            // .send({ name: name});
            // REPLACED WITH
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid' , async () => {
            // const res = await request(server)
            // .post('/api/genres')
            // .set('x-auth-token', token)
            // .send({ name: 'genre1' });
            // REPLACED WITH:

            await exec();
            const genre = await Genre.find({name:'genre1'});
            expect(genre).not.toBeNull(); 
        });
    
        it('should return the genre if it is valid' , async () => {
            // const res = await request(server)
            // .post('/api/genres')
            // .set('x-auth-token', token)
            // .send({ name: 'genre1' });
            //REPLACED WITH:
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','genre 1');
        });
    });

    describe('DELETE /:id', () => {
        it('should return 401 if client is not logged in' , async () => {

            const genre = new Genre({ name: 'genre 1' });
            await genre.save(); 

            const res = await request(server)
                .delete('/api/genres/' + genre._id);

            expect(res.status).toBe(401);
        });
    
        it('Should return 404 if invalid id is passed', async () => {
            const user = new User({ name: 'Admin Test', email:'admintest@gmail.com', password:'qwerty123', isAdmin: true });
            await user.save(); 
        
            const token = user.generateAuthToken();

            const res = await request(server)
                .delete('/api/genres/' + '5e9ae5b878b88f4c5f57c47a')
                .set('x-auth-token', token); 
                
            expect(res.status).toBe(404);
        });

        it('Should delete genre if valid id is passed', async () => {
            const user = new User({ name: 'Admin Test', email:'admintest@gmail.com', password:'qwerty123', isAdmin: true });
            await user.save(); 
        
            const token = user.generateAuthToken();

            const genre = new Genre({ name: 'genre 1' });
            await genre.save(); 

            const res = await request(server)
                .delete('/api/genres/' + genre._id)
                .set('x-auth-token', token); 

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    
    });

    
});