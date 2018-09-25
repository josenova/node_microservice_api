import * as request from 'supertest';

const token = 'DUMMYTOKEN';

import { configureMockDatabase } from '../../../modules/mock-db-helpers';
jest.setMock(
  '../../../modules/db-helpers',
  configureMockDatabase(['OrganizationStock']),
);

import { app } from '../../../index';

describe('v1', () => {
  describe('Get Organization Stock', () => {
    it('should return a 401 without token', done => {
      return request(app)
        .get('/v1/organization-stock/4021')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 404 without params', done => {
      return request(app)
        .get('/v1/organization-stock/')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end(done);
    });

    it('should return a 400 with invalid params', done => {
      return request(app)
        .get('/v1/organization-stock/sixsixsix')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 200/JSON for a correct request', done => {
      return request(app)
        .get('/v1/organization-stock/4021')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body.lastShipments).toBeInstanceOf(Array);
          expect(res.body.totalStock).toEqual(expect.any(Number));
          expect(res.body.lastShipments[0]).toMatchObject({
            currentStock: 500,
            numberOfStripsReceived: 500,
          });
          expect(res.body.lastShipments[1]).toMatchObject({
            currentStock: 2100,
            numberOfStripsReceived: 2500,
          });
          expect(res.body.totalStock).toEqual(2600);
        })
        .end(done);
    });
  });

  describe('Post Organization Stock Receive', () => {
    it('should return a 401 without token', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-received')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 404 without params', done => {
      return request(app)
        .post('/v1/organization-stock//strips-received')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end(done);
    });

    it('should return a 400 with invalid params', done => {
      return request(app)
        .post('/v1/organization-stock/sixsixsix/strips-received')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 400 with invalid body', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-received')
        .set('Authorization', `Bearer ${token}`)
        .send({
          actionPerformedAt: '2018-01-16T00:00:00.000Z',
          stripModelId: '419',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 200/JSON for a correct request', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-received')
        .set('Authorization', `Bearer ${token}`)
        .send({
          actionPerformedAt: '2018-03-14T11:14:08.370Z',
          numberOfStrips: '10',
          stripModelId: '419',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body.lastShipments).toBeInstanceOf(Array);
          expect(res.body.totalStock).toEqual(expect.any(Number));
          expect(res.body.lastShipments[0]).toMatchObject({
            currentStock: 510,
            numberOfStripsReceived: 500,
          });
          expect(res.body.lastShipments[1]).toMatchObject({
            currentStock: 2100,
            numberOfStripsReceived: 2500,
          });
          expect(res.body.totalStock).toEqual(2610);
        })
        .end(done);
    });
  });

  describe('Post Organization Stock Delivery', () => {
    it('should return a 401 without token', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-delivered')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 404 without params', done => {
      return request(app)
        .post('/v1/organization-stock//strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end(done);
    });

    it('should return a 400 with invalid params', done => {
      return request(app)
        .post('/v1/organization-stock/sixsixsix/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 400 with invalid body', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .send({
          stripModelId: '419',
          umberOfStrips: '10',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 200/JSON for a correct request', done => {
      return request(app)
        .post('/v1/organization-stock/4021/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .send({
          actionPerformedAt: '2018-03-14T11:14:08.370Z',
          numberOfStrips: '10',
          stripModelId: '419',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body.lastShipments).toBeInstanceOf(Array);
          expect(res.body.totalStock).toEqual(expect.any(Number));
          expect(res.body.lastShipments[0]).toMatchObject({
            currentStock: 490,
            numberOfStripsReceived: 500,
          });
          expect(res.body.lastShipments[1]).toMatchObject({
            currentStock: 2100,
            numberOfStripsReceived: 2500,
          });
          expect(res.body.totalStock).toEqual(2590);
        })
        .end(done);
    });
  });

  describe('Delete Organization Stock Delivery', () => {
    it('should return a 401 without token', done => {
      return request(app)
        .delete('/v1/organization-stock/4021/strips-delivered')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 404 without params', done => {
      return request(app)
        .delete('/v1/organization-stock//strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .end(done);
    });

    it('should return a 400 with invalid params', done => {
      return request(app)
        .delete('/v1/organization-stock/sixsixsix/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 400 with invalid body', done => {
      return request(app)
        .delete('/v1/organization-stock/4021/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .send({
          actionPerformedAt: '2018-03-14T11:14:08.370Z',
          stripModelId: '419',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a 200/JSON for a correct request', done => {
      return request(app)
        .delete('/v1/organization-stock/4021/strips-delivered')
        .set('Authorization', `Bearer ${token}`)
        .send({
          actionPerformedAt: '2018-03-14T11:14:08.370Z',
          numberOfStrips: '10',
          stripModelId: '419',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body.lastShipments).toBeInstanceOf(Array);
          expect(res.body.totalStock).toEqual(expect.any(Number));
          expect(res.body.lastShipments[0]).toMatchObject({
            currentStock: 510,
            numberOfStripsReceived: 500,
          });
          expect(res.body.lastShipments[1]).toMatchObject({
            currentStock: 2100,
            numberOfStripsReceived: 2500,
          });
          expect(res.body.totalStock).toEqual(2610);
        })
        .end(done);
    });
  });
});
