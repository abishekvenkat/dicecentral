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

app.get('/swagger.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/swagger.yaml'), {
    headers: { 'Content-Type': 'application/yaml' },
  });
});

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
        apiDescriptionUrl="/swagger.yaml"
        router="hash"
        layout="sidebar"
      ></elements-api-documentation>
    </body>
    </html>
  `);
});

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

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