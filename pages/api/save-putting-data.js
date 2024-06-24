// pages/api/save-putting-data.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("API endpoint called");
        try {
            const client = await clientPromise;
            console.log("MongoDB client connected");
            const db = client.db(process.env.MONGODB_DB);
            const collection = db.collection('putting');
            console.log("Data to be inserted:", req.body);
            const result = await collection.insertOne(req.body);
            console.log("Data inserted successfully:", result);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error("Error inserting data:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
