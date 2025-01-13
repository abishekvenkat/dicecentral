# DiceCentral API 🎲

A modern, RESTful API for rolling various types of polyhedral dice. Perfect for digital tabletop games, random number generation, or any application needing dice rolling functionality.

## 🌟 Features

- Roll different types of polyhedral dice (d4, d6, d8, d10, d12, d20, d100)
- Support for rolling multiple dice at once
- Clean, interactive API documentation using Stoplight Elements
- JSON responses with individual rolls and totals
- CORS enabled for cross-origin requests
- Production-ready with Vercel deployment support

## 🚀 Live Demo

Visit [https://dicecentral.vercel.app](https://dicecentral.vercel.app) to try out the API and view the interactive documentation.

## 📖 API Usage

### Roll Endpoint

```http
GET /roll?diceType={type}&numDice={count}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| diceType | integer | Yes | Number of sides on the die (4, 6, 8, 10, 12, 20, or 100) |
| numDice | integer | No | Number of dice to roll (default: 1) |

#### Example Request

```http
GET /roll?diceType=20&numDice=2
```

#### Example Response

```json
{
  "diceType": 20,
  "numDice": 2,
  "rolls": [15, 8],
  "total": 23
}
```

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/abishekvenkat/dicecentral.git
cd dicecentral
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📦 Project Structure

```
dicecentral/
├── index.js          # Main server file
├── public/           # Static files
│   ├── index.html    # API documentation UI
│   └── dice-icon.svg # App icon
├── vercel.json       # Vercel deployment configuration
└── package.json      # Project dependencies and scripts
```

## 🚀 Deployment

This API is configured for deployment on Vercel. To deploy your own instance:

1. Fork this repository
2. Connect your fork to Vercel
3. Deploy!

No additional configuration is needed as the `vercel.json` file handles all deployment settings.