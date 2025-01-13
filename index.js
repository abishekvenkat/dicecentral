const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

// Define OpenAPI documentation as a JavaScript object (embedded instead of YAML)
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Dice Central API",
    description: "A simple API for rolling various types of dice",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
    },
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

app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dice Central API Documentation</title>
      <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-rc.70/bundles/redoc.standalone.js"></script>
    </head>
    <body>
      <redoc spec-url="/swagger.json"></redoc>
    </body>
    </html>
  `);
});

// Serve the Swagger documentation in JSON format
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Main route to redirect to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Example dice roll endpoint
app.get('/roll', (req, res) => {
  const diceType = parseInt(req.query.diceType);
  const numDice = parseInt(req.query.numDice) || 1;

  const VALID_DICE = [4, 6, 8, 10, 12, 20, 100];
  if (!VALID_DICE.includes(diceType)) {
    return res.status(400).json({
      error: `Invalid dice type. Supported types are: ${VALID_DICE.join(', ')}`
    });
  }

  if (numDice < 1) {
    return res.status(400).json({
      error: 'Number of dice must be at least 1'
    });
  }

  const rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.floor(Math.random() * diceType) + 1);
  }

  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  res.json({
    diceType,
    numDice,
    rolls,
    total
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Dice API running on http://localhost:${port}`);
});
