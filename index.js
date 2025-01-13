const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// OpenAPI documentation
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Dice Central API",
    description: "A simple API for rolling various types of dice",
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.VERCEL_URL ? `https://dicecentral.vercel.app` : `http://localhost:${port}`,
    }
  ],
  paths: {
    "/roll": {
      get: {
        summary: "Roll dice",
        parameters: [
          {
            in: "query",
            name: "diceType",
            required: true,
            schema: {
              type: "integer",
              enum: [4, 6, 8, 10, 12, 20, 100],
            },
            description: "Number of sides on the die",
          },
          {
            in: "query",
            name: "numDice",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            description: "Number of dice to roll",
          },
        ],
        responses: {
          "200": {
            description: "Successful roll",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    diceType: { type: "integer" },
                    numDice: { type: "integer" },
                    rolls: {
                      type: "array",
                      items: { type: "integer" },
                    },
                    total: { type: "integer" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid input parameters",
          },
        },
      },
    },
  },
};

// Serve OpenAPI spec
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Serve static files from the public directory
app.use(express.static('public'));

// Implement the roll endpoint
app.get('/roll', (req, res) => {
  const diceType = parseInt(req.query.diceType);
  const numDice = parseInt(req.query.numDice) || 1;
  
  if (!swaggerDocument.paths['/roll'].get.parameters[0].schema.enum.includes(diceType)) {
    return res.status(400).json({ error: 'Invalid dice type' });
  }
  
  if (numDice < 1) {
    return res.status(400).json({ error: 'Number of dice must be at least 1' });
  }
  
  const rolls = Array.from({ length: numDice }, () => 
    Math.floor(Math.random() * diceType) + 1
  );
  
  res.json({
    diceType,
    numDice,
    rolls,
    total: rolls.reduce((a, b) => a + b, 0)
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});