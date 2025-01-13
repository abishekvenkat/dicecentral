const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const swaggerDocument = YAML.load(path.join(__dirname, 'public/swagger.yaml'));

const VALID_DICE = [4, 6, 8, 10, 12, 20, 100];

function rollDie(max) {
  return Math.floor(Math.random() * max) + 1;
}

function rollMultipleDice(diceType, numDice) {
  const rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(rollDie(diceType));
  }
  return rolls;
}

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Dice Central API Documentation",
  swaggerOptions: {
    url: "/swagger.yaml",
    baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  }
};

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/roll', (req, res) => {
  const diceType = parseInt(req.query.diceType);
  const numDice = parseInt(req.query.numDice) || 1;

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

  const rolls = rollMultipleDice(diceType, numDice);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  res.json({
    diceType,
    numDice,
    rolls,
    total
  });
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`Dice API running successfully`);
  });
}