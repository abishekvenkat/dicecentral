## Dice Central API
A simple REST API for rolling various types of polyhedral dice, built with Express.js.

#### Features
- Roll different types of dice (d4, d6, d8, d10, d12, d20, d100)
- Roll multiple dice at once
- API documentation with Swagger UI
- JSON responses with roll results and totals


#### Installation

##### Usage

Start the server:

The server will run on port 3000. Visit http://localhost:3000 to view the Swagger API documentation.

***API Endpoints***

***GET /roll***

Roll one or more dice of a specific type.

Query Parameters:

- diceType (required): Number of sides on the die (4, 6, 8, 10, 12, 20, or 100)
- numDice (optional): Number of dice to roll (default: 1)

Example Request:

```
GET /roll?diceType=6&numDice=2
```

Example Response:

```
{
  "diceType": 6,
  "numDice": 2,
  "rolls": [4, 5],
  "total": 9
}
```

#### Dependencies
- express: Web framework
- swagger-ui-express: API documentation UI
- yamljs: YAML parser
