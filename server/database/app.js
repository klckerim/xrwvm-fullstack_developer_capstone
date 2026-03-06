const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviewsData = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
const dealershipsData = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviewsData.reviews);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealershipsData.dealerships);
  });
} catch (error) {
  console.error('Error resetting startup data', error);
}

app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', (req, res) => {
  Reviews.find()
    .then((documents) => {
      res.json(documents);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error fetching all reviews' });
    });
});

app.get('/fetchReviews/dealer/:id', (req, res) => {
  Reviews.find({ dealership: req.params.id })
    .then((documents) => {
      res.json(documents);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error fetching reviews by a particular dealer' });
    });
});

app.get('/fetchDealers', (req, res) => {
  Dealerships.find()
    .then((documents) => {
      res.json(documents);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error fetching dealerships' });
    });
});

app.get('/fetchDealers/:state', (req, res) => {
  Dealerships.find({ state: req.params.state })
    .then((documents) => {
      res.json(documents);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error fetching Dealers by a particular state' });
    });
});

app.get('/fetchDealer/:id', (req, res) => {
  Dealerships.find({ id: req.params.id })
    .then((documents) => {
      res.json(documents);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error fetching dealer by a particular id' });
    });
});

app.post('/insert_review', express.raw({ type: '*/*' }), (req, res) => {
  const data = JSON.parse(req.body);

  Reviews.find().sort({ id: -1 })
    .then((documents) => {
      const newId = documents[0].id + 1;
      const review = new Reviews({
        id: newId,
        name: data.name,
        dealership: data.dealership,
        review: data.review,
        purchase: data.purchase,
        purchase_date: data.purchase_date,
        car_make: data.car_make,
        car_model: data.car_model,
        car_year: data.car_year,
      });
      return review.save();
    })
    .then((savedReview) => {
      res.json(savedReview);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Error inserting review' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
