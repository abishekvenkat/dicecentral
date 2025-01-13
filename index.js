const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

// Serve the documentation using Stoplight Elements UI
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dice Central API Documentation</title>
      <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
    </head>
    <body>
      <elements-api-documentation
        apiDescriptionUrl="/swagger.json"
        router="hash"
        layout="sidebar"
      ></elements-api-documentation>
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
