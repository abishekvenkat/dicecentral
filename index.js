const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Swagger documentation as an embedded object
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

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(port, () => {
  console.log(`Dice API running on http://localhost:${port}`);
});
