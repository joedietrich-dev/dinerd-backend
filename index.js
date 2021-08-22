require('dotenv').config();
const axios = require('axios');
const express = require('express');
const port = process.env.PORT || 80;
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get('/restaurants', (req, res) => {
  if (req.query.location && req.query.price && req.query.distance) {
    // More results when omitting price
    const priceQuery = req.query.price === '1,2,3,4' ? '' : `&price=${req.query.price}`;
    axios({
      method: 'get',
      url: `https://api.yelp.com/v3/businesses/search?term=food&limit=50&location=${req.query.location}&radius=${req.query.distance}${priceQuery}`,
      headers: {
        Authorization: `Bearer ${process.env.YELP_KEY}`
      }
    }).then(yelpResponse => res.send(yelpResponse.data))
      .catch(err => {
        console.log(req.query);
        res.status(400).send(err.message);
      });
  } else {
    console.log(req.query);
    res.status(404).send('No match for requested URL found.');
  }
})
app.get('/', (req, res) => res.send('Server is Active'));
app.use(function (req, res, next) {
  res.status(404).send('No match for requested URL found.')
})
app.listen(port, () => console.log('Listening on port ' + port));


