'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import "database"
const { stock, customers } = require('./data/promo');

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
})
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// Order object on successful purchase
let orderConfirmed = {};

// endpoints
app.post('/order', (req, res) => {
  const orderInfo = req.body;
  module.exports = { orderInfo: orderInfo, res: res };

  // Function to throw errors
const handleError = (error) => {
  if (res.statusMessage !== 'error') {
      switch (error) {
      case 'repeat-customer':
          res.json({ status: 'error', error: 'repeat-customer' });
          res.statusMessage = 'error';
          break;
      case 'undeliverable':
          res.json({ status: 'error', error: 'undeliverable' });
          res.statusMessage = 'error';
          break;
      case 'unavailable':
          res.json({ status: 'error', error: 'unavailable' });
          res.statusMessage = 'error';
          break;
      case 'missing-data':
          res.json({ status: 'error', error: 'missing-data' });
          res.statusMessage = 'error';
          break;
      }
  }
}

// Function to check for repeat customers
const checkRepeatCustomer = () => {
  customers.forEach( (customer) => {
      // Check for repeat customer by name
      if (customer.givenName.toLowerCase() === orderInfo.givenName.toLowerCase() && 
      customer.surname.toLowerCase() === orderInfo.surname.toLowerCase()) {
          // Throw error
          handleError('repeat-customer');
      // Check for repeat customer by email
      } else if (customer.email.toLowerCase() === orderInfo.email.toLowerCase()) {
          // Throw error
          handleError('repeat-customer');
      // Check for repeat customer by address
      } else if (customer.address.toLowerCase() === orderInfo.address.toLowerCase()) {
          // Throw error
          handleError('repeat-customer');
      }
  });
};

// Function to check if the country is Canada
const checkCountry = () => {
  if (orderInfo.country.toLowerCase() !== 'canada') handleError('undeliverable');
};

// Function to check if item is in stock
const checkStock = () => {
  const order = orderInfo.order;
  const size = orderInfo.size;
  if (stock[order] <= 0 || stock[order][size] <= 0) handleError('unavailable');
};

// Function to check for missing form data
const checkMissingData = () => {
  // Create array of form input values
  const formValues = Object.values(orderInfo);
  // Check each array item for empty strings
  formValues.forEach( (value) => {
      if (value.trim() === '') handleError('missing-data');
  });
};

  checkRepeatCustomer();
  checkCountry();
  checkStock();
  checkMissingData();

  // If no errors are found, proceed to success
  if (res.statusMessage !== 'error') {
    orderConfirmed = orderInfo;
    res.json({ status: 'success' });
  }
});

// Order-confirmed endpoint
app.get('/order-confirmed', (req, res) => {
  res.render('pages/order-confirmed', { order: orderConfirmed });
});

app.get('*', (req, res) => res.send('Dang. 404.'))
app.listen(8000, () => console.log(`Listening on port 8000`));
