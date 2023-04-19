const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db =pgp('postgres://kb:@127.0.0.1:5432/telecom_company');


// Find a bill by ID

router.get('/bills/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;
    db.oneOrNone('SELECT * FROM bills WHERE id = $1', [customer_id])
      .then((bill) => {
        if (bill) {
          res.status(200).json(bill);
        } else {
          res.status(404).json({ message: 'Bill not found.' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error finding bill.' });
      });
  });
  

// Add a new bill for a customer
router.post('/bills', (req, res) => {
  const { customer_id, bill_date, minutes_used, texts_sent, data_consumed, outgoing_calls, billing_amount } = req.body;
  db.none('INSERT INTO bills (customer_id, bill_date, minutes_used, texts_sent, data_consumed, outgoing_calls, billing_amount) VALUES ($1, $2, $3, $4, $5, $6, $7)', [customer_id, bill_date, minutes_used, texts_sent, data_consumed, outgoing_calls, billing_amount])
    .then(() => {
      res.status(201).json({ message: 'Bill added successfully.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    });
});

// Update an existing bill
router.put('/bills/:customer_id', (req, res) => {
  const {bill_date, minutes_used, texts_sent, data_consumed, outgoing_calls, billing_amount} = req.body;
  const customer_id = req.params.customer_id;
  db.none('UPDATE bills SET bill_date = $1, minutes_used = $2, texts_sent = $3, data_consumed = $4, outgoing_calls = $5, billing_amount = $6 WHERE id = $5', [bill_date, minutes_used, texts_sent, data_consumed, outgoing_calls, billing_amount])
    .then(() => {
      res.status(200).json({ message: 'Bill updated successfully.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    });
});

// Delete a bill
router.delete('/bills/:customer_id', (req, res) => {
  const customer_id = req.params.customer_id;
  db.none('DELETE FROM bills WHERE id = $1', [customer_id])
    .then(() => {
      res.status(200).json({ message: 'Bill deleted successfully.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    });
});

module.exports = router