// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
 app.post('/', (req, res) => {
  const body = req.body;

  // Verificamos que sea un evento de WhatsApp
  if (body.object === 'whatsapp_business_account') {
    
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // El número de teléfono del cliente
      const msgBody = message.text ? message.text.body : "Mensaje no es texto"; // El texto que envió

      console.log(`Mensaje recibido de ${from}: ${msgBody}`);

      // AQUÍ LLAMARÍAS A UNA FUNCIÓN PARA RESPONDER (Paso 3)
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(404).end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});