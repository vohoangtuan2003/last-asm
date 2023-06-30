const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb+srv://tuanvhgcs210295:123456789a@cluster0.dic42ej.mongodb.net/';
const dbName = 'productDB';


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);

  const db = client.db(dbName);
  const productsCollection = db.collection('products');

  app.get('/', (req, res) => {
    productsCollection.find().toArray((err, products) => {
      if (err) return console.error(err);

      res.render('index', { products });
    });
  });

  app.post('/add', (req, res) => {
    const { productId, name, price, image } = req.body;

    const product = {
      productId,
      name,
      price,
      image,
    };

    productsCollection.insertOne(product, (err, result) => {
      if (err) return console.error(err);

      console.log('Product added:', product);
      res.redirect('/');
    });
  });
// ...

app.post('/delete', (req, res) => {
  const productId = req.body.productId;

  productsCollection.deleteOne({ _id: ObjectId(productId) }, (err, result) => {
    if (err) return console.error(err);

    console.log('Product deleted:', productId);
    res.redirect('/');
  });
});

// ...

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
