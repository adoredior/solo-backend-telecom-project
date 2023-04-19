const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db =pgp('postgres://kb:@127.0.0.1:5432/telecom_company');


// Find a customer by ID
router.get('/customer/:customer_id', (req, res) => {
  console.log(db)
  const customer_id = req.params.customer_id;
  db.oneOrNone('SELECT * FROM customers WHERE id = $1', [customer_id])
    .then((customer) => {
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: 'Customer not found.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error finding customer.' });
    });
});


// Add a new customer to the database
router.post('/customer', (req, res) => {
  const { first_name, last_name, phone_number, city, state, gender } = req.body;
  db.one('INSERT INTO customers (first_name, last_name, phone_number, city, state, gender) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [first_name, last_name, phone_number, city, state, gender])
    .then((result) => {
      res.status(201).json({ message: 'Customer added successfully.', customer_id: result.id });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error adding customer.' });
    });
});


// Update a customer's profile
router.put('/customer/:customer_id', (req, res) => {
  const customer_id = req.params.customer_id;
  const { first_name, last_name, phone_number, city, state, gender } = req.body;
  db.none('UPDATE customers SET first_name = $1, last_name = $2, phone_number = $3, city = $4, state = $5, gender = $6 WHERE id = $7', [first_name, last_name, phone_number, city, state, gender, customer_id])
    .then(() => {
      res.status(200).json({ message: 'Customer profile updated successfully.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error updating customer profile.' });
    });
});

// Remove a customer who has discontinued service

router.delete('/customer/:customer_id', (req, res) => {
  const customer_id = req.params.customer_id;
  db.none('DELETE FROM customers WHERE id = $1', [customer_id])
    .then(() => {
      res.status(200).json({ message: 'Customer removed successfully.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error removing customer.' });
    });
});


module.exports = router
