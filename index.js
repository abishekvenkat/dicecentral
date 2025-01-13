const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 3000;

// Dice types supported by the API
const VALID_DICE = [4, 6, 8, 10, 12, 20, 100];

// Function to generate a random number between 1 and max
function rollDie(max) {
  return Math.floor(Math.random() * max) + 1;
}

// Function to roll multiple dice
function rollMultipleDice(diceType, numDice) {
  const rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(rollDie(diceType));
  }
  return rolls;
}

// API Documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Dice Central API',
    version: '1.0.0',
    description: 'An API for rolling different types of dice with probability calculations'
  },
  paths: {
    '/roll': {
      get: {
        summary: 'Roll dice',
        parameters: [
          {
            name: 'diceType',
            in: 'query',
            required: true,
            schema: {
              type: 'integer',
              enum: VALID_DICE
            },
            description: 'Number of sides on the die (4, 6, 8, 10, 12, 20, or 100)'
          },
          {
            name: 'numDice',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
              minimum: 1
            },
            description: 'Number of dice to roll (defaults to 1)'
          }
        ],
        responses: {
          '200': {
            description: 'Successful roll',
            content: {
              'application/json': {
                example: {
                  diceType: 6,
                  numDice: 2,
                  rolls: [4, 5],
                  total: 9
                }
              }
            }
          },
          '400': {
            description: 'Invalid input parameters'
          }
        }
      }
    }
  }
};

// Serve API documentation at root
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Mount Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Roll endpoint
app.get('/roll', (req, res) => {
  const diceType = parseInt(req.query.diceType);
  const numDice = parseInt(req.query.numDice) || 1;

  // Validate input
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

  // Perform the roll
  const rolls = rollMultipleDice(diceType, numDice);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  res.json({
    diceType,
    numDice,
    rolls,
    total
  });
});

app.listen(port, () => {
  console.log(`Dice API running successfully`);
});