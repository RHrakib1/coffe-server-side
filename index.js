const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000



app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oi7zo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const database = client.db("databaseCoffe");
    const coffeCollection = database.collection("coffe");
    try {
        await client.connect();

        app.get('/coffe', async (req, res) => {
            const coures = coffeCollection.find()
            const result = await coures.toArray()
            res.send(result)

        })
        // upadete now
        app.get('/coffe/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await coffeCollection.findOne(quary)
            res.send(result)
        })
        app.put('/coffe/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatecoffe = req.body
            const coffedatabase = {
                $set: {
                    name: updatecoffe.name,
                    quantity: updatecoffe.quantity,
                    Supplier: updatecoffe.Supplier,
                    Taste: updatecoffe.Taste,
                    Category: updatecoffe.Category,
                    Details: updatecoffe.Details,
                    Photo: updatecoffe.Photo
                }
            }
            const result = await coffeCollection.updateOne(filter, coffedatabase, option)
            res.send(result)
        })

        app.post('/coffe', async (req, res) => {
            const user = req.body
            const result = await coffeCollection.insertOne(user)
            console.log('this data is', result);
            res.send(result)
        })

        app.delete('/coffe/:id', async (req, res) => {
            const id = req.params.id
            console.log('this is a delete id :', id);
            const quary = { _id: new ObjectId(id) }
            const result = await coffeCollection.deleteOne(quary)
            console.log('this is a delete result :', result);
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})