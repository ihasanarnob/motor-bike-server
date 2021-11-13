const express = require('express')
const { MongoClient } = require('mongodb');

require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtza7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("bikeDB");
        const bikeCollection = database.collection("bikes");
        const purchaseCollection = database.collection("purchase");
        // Post products
        app.post('/addProducts', async (req, res) => {
            const newProduct = req.body;
            const result = await bikeCollection.insertOne(newProduct);
            res.json(result);
        });
        // Get all products
        app.get('/featured', async (req, res) => {
            const result = await bikeCollection.find({}).toArray();
            res.send(result);
        })

        app.get('/services', async (req, res) => {
            const result = await bikeCollection.find({}).limit(6).toArray();
            console.log(result);
            res.send(result);
        })

        // get single product
        app.get('/placeOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bikeCollection.findOne(query);
            res.send(result);

        })

        // Purchase products api 
        app.post('/purchase', async (req, res) => {
            const newOrder = req.body;
            const result = await purchaseCollection.insertOne(newOrder);
            res.json(result);
        });

        app.get(`/purchase/:email`, async (req, res) => {

            const result = await purchaseCollection.find({ email : req.params.email}).toArray();
            res.send(result);
        });

         // DELETE FROM PURCHASE 
    app.delete('/purchase/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:req.params.id};
        const result = await purchaseCollection.deleteOne(query);
        res.json(result);
        
      })
    


    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`motor-bike-server at http://localhost:${port}`)
})