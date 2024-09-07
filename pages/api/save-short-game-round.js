export default function handler(req, res) {
  if (req.method === 'POST') {
    const { course, missedGreens } = req.body;
    console.log('Saved Short Game Round:', { course, missedGreens });
    res.status(200).json({ message: 'Round saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
