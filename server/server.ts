import express from 'express';
import cors from 'cors';

interface Revenue {
  category: string;
  amount: number;
  date: string;
  username: string;
}


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express Server!');
});

let revenues: Revenue[] = [];

app.post('/api/revenues', (req, res) => {
    try {
        const revenue: Revenue = req.body;

        // Basic validation
        if (!revenue.category || !revenue.amount || !revenue.date || !revenue.username) {
            return res.status(400).json({ error: 'Invalid revenue data' });
        }

        revenues.push(revenue);
        res.status(201).json({ message: 'Revenue added successfully', revenue });
    } catch (error) {
        console.error('Error adding revenue:', error);
        res.status(500).json({ error: 'Failed to add revenue' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;