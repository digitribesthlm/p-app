// File: /pages/api/getPuttingData.js
import { connectToDatabase } from '../../lib/mongodb';

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();

            const puttingData = await db.collection('putting').find({}).toArray();
            const puttingStats = await db.collection('putting_stats').find({}).toArray();

            const { hcp } = req.query;
            const filteredPuttingStats = puttingStats.map(stat => ({
                ...stat,
                statistics: {
                    [hcp]: stat.statistics[hcp]
                }
            }));
            res.status(200).json({ puttingData, puttingStats: filteredPuttingStats });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
