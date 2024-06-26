import { expect } from 'chai';
import request from 'supertest';
import mockRequire from 'mock-require';
import sinon from 'sinon';

const transporter = {
  sendMail: sinon.stub().resolves({ messageId: 'fake-message-id' }),
};

mockRequire('nodemailer', {
  createTransport: () => transporter,
});

const app = (await import('../server.mjs')).default;

describe('Server API Endpoints', () => {
  describe('POST /send-ticket', () => {
    it('should return 400 if bookingDetails or userEmail is missing', async () => {
      const res = await request(app)
        .post('/send-ticket')
        .send({});
      
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid request data');
    });

    it('should return 500 if there is an error generating the ticket', async () => {
      const res = await request(app)
        .post('/send-ticket')
        .send({
          bookingDetails: { timeSlot: 'invalid-date', date: 'invalid-date' },
          userEmail: 'test@example.com'
        });
      
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal('Failed to generate ticket');
    });

    it('should return 200 and send ticket if request data is valid', async function() {
      this.timeout(5000);

      const res = await request(app)
        .post('/send-ticket')
        .send({
          bookingDetails: { timeSlot: '2024-05-17T10:00:00Z', date: '2024-05-17', museumName: 'Museum of Art' },
          userEmail: 'test@example.com'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Ticket sent!');
      expect(transporter.sendMail.calledOnce).to.be.false;
    });

    it('should return 500 if there is an error sending the email', async () => {
      transporter.sendMail.rejects(new Error('No recipients defined'));

      const res = await request(app)
        .post('/send-ticket')
        .send({
          bookingDetails: { timeSlot: '2024-05-17T10:00:00Z', date: '2024-05-17', museumName: 'Museum of Art' },
          userEmail: 'invalid-email'
        });
      
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal('Failed to send ticket');
    });
  });

  describe('POST /geocode', () => {
    it('should return 400 if address is missing', async () => {
      const res = await request(app)
        .post('/geocode')
        .send({});
      
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Address is required');
    });

    it('should return coordinates for a valid address', async () => {
      const res = await request(app)
        .post('/geocode')
        .send({ address: '1600 Amphitheatre Parkway, Mountain View, CA' });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('lat');
      expect(res.body).to.have.property('lng');
    });

    it('should return 404 if the address is not found', async () => {
      const res = await request(app)
        .post('/geocode')
        .send({ address: 'Nonexistent Address' });
      
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Address not found');
    });
  });

  describe('POST /fetch-weather', () => {
    it('should return 400 if cityName is missing', async () => {
      const res = await request(app)
        .post('/fetch-weather')
        .send({});
      
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('City name is required');
    });

    it('should return weather data for a valid city', async () => {
      const res = await request(app)
        .post('/fetch-weather')
        .send({ cityName: 'London' });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('list');
    });

    it('should return 500 if there is an error fetching weather data', async () => {
      const res = await request(app)
        .post('/fetch-weather')
        .send({ cityName: 'InvalidCityName' });
      
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal('Error fetching weather data');
    });
  });
});
