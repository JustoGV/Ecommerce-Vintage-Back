const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN
});

// Ruta /api/checkout
const checkout= async (req, res) => {
  try {
    const product = req.body.product;
    // console.log(product.tittle,'acaa')

    const URL = 'https://app-kappa-blond.vercel.app';

    const preference = {
      items: [
        {
          title: product.title,
          unit_price: product.price,
          quantity: 1,
        },
      ],
      auto_return: 'approved',
      back_urls: {
        success: `${URL}`,
        failure: `${URL}`
      },
      notification_url: `${URL}/api/notify`
    };
    console.log(URL)
    const response = await mercadopago.preferences.create(preference);

    res.status(200).send({ url: response.body.init_point });
  } catch (error) {
    console.log(error); 
    res.status(400).json({ message: error.message });
  }
};

module.exports = checkout;