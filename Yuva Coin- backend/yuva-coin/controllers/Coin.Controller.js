const Coin = require('../models/Coin');
const Joi = require('joi');

// Get all coins
const getAllCoins = async (req, res) => {
  try {
    const coins = await Coin.find({}, { _id: false });
    res.json(coins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Set prices for a specific coin
const setCoinPrices = async (req, res) => {
  // Define a schema for request body validation
const schema = Joi.object({
  // inr: Joi.number().required(),
  usdt: Joi.number().required(),
  matic: Joi.number().required(),
  bnb: Joi.number().required(),
});


  try {

    const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {  usdt, matic, bnb } = value;

    let coin = await Coin.findOne();

    if (!coin) {
      coin = new Coin({
        price: {
          usdt,
          matic,
          bnb,
        },
      });
    } else {
      coin.price.usdt = usdt;
      coin.price.matic = matic;
      coin.price.bnb = bnb;
    }

    await coin.save();

    res.json({ message: 'Prices set successfully', coin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCoins,
  setCoinPrices,
};