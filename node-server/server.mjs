import express from 'express';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import cors from 'cors';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path'
import { format } from 'date-fns';

const app = express();

app.use(cors());
app.use(express.json());

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'husenovmurad24@gmail.com',
    pass: 'dycnkgsodjeukdjp'
  }
});

app.post('/send-ticket', async (req, res) => {
  const { bookingDetails, userEmail } = req.body;
  
  if (!bookingDetails || !userEmail) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  try {
    const timeSlotFormatted = format(new Date(bookingDetails.timeSlot), 'HH:mm');
    const dateFormatted = format(new Date(bookingDetails.date), 'MM/dd/yyyy');

    const qrCodeData = JSON.stringify({
      museumName: bookingDetails.museumName,
      date: dateFormatted,
      time: timeSlotFormatted,
    });

    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      let pdfData = Buffer.concat(buffers);
      
      try {
        await sendEmailWithPDF(userEmail, pdfData);
        res.send({ message: 'Ticket sent!' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send ticket' });
      }
    });

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const imageFilePath = path.join(__dirname, '..', 'museum-app1', 'src', 'assets', 'thesis_icon1.png');
    doc.image(imageFilePath, 490, 30, { width: 80 });

    doc.moveDown(3);
    doc.fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('black')
      .text('Ticket Details', { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(12)
      .font('Helvetica')
      .text(`Museum: ${bookingDetails.museumName}`)
      .text(`Date: ${dateFormatted}`)
      .text(`Time: ${timeSlotFormatted}`)

    doc.moveDown(1);
    doc.image(qrCodeUrl, {
      fit: [100, 100],
      align: 'center',
      valign: 'center'
    });

    doc.end();
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).send({ message: 'Failed to generate ticket' });
  }
});

const sendEmailWithPDF = async (email, pdfData) => {
  let info = await transporter.sendMail({
    from: '"Museum Booking" <husenovmurad24@gmail.com>',
    to: email,
    subject: 'Global Museum Management - Ticket Booking',
    text: 'Dear Customer, \n\nAttached you can find your requested ticket.\n\nWe hope you will spend quality time.\n\nBest regards,\nGlobal Museum Management Team',
    attachments: [
      {
        filename: 'ticket.pdf',
        content: pdfData,
      },
    ],
  });

  console.log('Message sent: %s', info.messageId);
};

app.listen(3001, () => {
  console.log('Server started on port 3001');
});

const geocodeAddress = async (address, apiKey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Geocoding failed:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

app.post('/geocode', async (req, res) => {
  const { address } = req.body;
    
  if (!address) {
    return res.status(400).send({ message: 'Address is required' });
  }
  
  const apiKey = 'AIzaSyCHJRv-h8wo-SuKO0yVvV8FNfdh96AaYl8';
  const coords = await geocodeAddress(address, apiKey);
    
  if (coords) {
    res.json(coords);
  } else {
    res.status(404).send({ message: 'Address not found' });
  }
});

app.post('/fetch-weather', async (req, res) => {
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).send({ message: 'City name is required' });
  }
  const apiKey = "6c1019cd77aff8207e682a2a2ff1c8e2";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

  try {
    console.log(`Requesting weather data from URL: ${url}`);
    const response = await fetch(url);
    console.log(`Response Status: ${response.status}`);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error fetching weather data:", error);
    res.status(500).send({ message: "Error fetching weather data" });
  }
});

export default app;