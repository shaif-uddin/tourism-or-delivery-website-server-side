const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

// MongoDb 
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r252i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const happytourbds = async () => {
    try {
        await client.connect();
        const toursCollection = client.db('happytourbd').collection('tours');
        const bookingCollection = client.db('happytourbd').collection('bookings');

        // Post New Package 
        app.post('/tours', async (req, res) => {
            const tourpackage = req.body;
            const result = await toursCollection.insertOne(tourpackage);
            res.send(result);
        })

        // Get All Packages 
        app.get('/tours', async (req, res) => {
            const tours = toursCollection.find({});
            const result = await tours.toArray();
            res.send(result);
        })

        // Get Tour Information By TourID 
        app.get('/tours/:tourParamID', async (req, res) => {
            const tourID = req.params.tourParamID;
            const query = { _id: ObjectId(tourID) };
            const result = await toursCollection.findOne(query);
            res.send(result);
        })
        // Update Specific Package Information 
        app.put('/tours/:tourParamID', async (req, res) => {
            const tourID = req.params.tourParamID;
            const getUpdateData = req.body;
            const filter = { _id: ObjectId(tourID) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    title: getUpdateData.title,
                    duration: getUpdateData.duration,
                    attraction: getUpdateData.attraction,
                    location: getUpdateData.location,
                    routes: getUpdateData.routes,
                    startingPrice: getUpdateData.startingPrice,
                    tourpicture: getUpdateData.tourpicture,
                    description: getUpdateData.description,
                },
            };
            const result = await toursCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // Add New Boking 
        app.post('/tour/booked', async (req, res) => {
            const tourRequest = req.body;
            const result = await bookingCollection.insertOne(tourRequest);
            res.send(result);
        })
        // Get Booking History by user email 
        app.get('/user/bookings/:bookingParamID', async (req, res) => {
            const userEmail = req.params.bookingParamID;
            const query = { email: userEmail };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })
        // Cancel Booking By User and Admin
        app.put('/user/bookings/cancel/:bookingID', async (req, res) => {
            const userBookingID = req.params.bookingID;
            const filter = { _id: ObjectId(userBookingID) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: 'cancel'
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // Delete Booking By User and Admin
        app.delete('/user/bookings/delete/:bookingID', async (req, res) => {
            const userBookingID = req.params.bookingID;
            const query = { _id: ObjectId(userBookingID) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })
        // Get All Users Bookings
        app.get('/user/bookings', async (req, res) => {
            const allBookings = bookingCollection.find({});
            const result = await allBookings.toArray();
            res.send(result);
        })
        // Confirm Booking By Admin 
        app.put('/user/bookings/confirm/:bookingID', async (req, res) => {
            const userBookingID = req.params.bookingID;
            const filter = { _id: ObjectId(userBookingID) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: 'confirm'
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }
    finally {
    }
}
happytourbds().catch(() => console.dir());
app.listen(PORT, () => console.log('Connect'));