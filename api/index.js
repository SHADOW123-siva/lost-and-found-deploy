const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://lost-and-found-deploy-1yn3.vercel.app',
  credentials: true
}));

app.use(express.json());

app.use('/api', authRouter);    
app.use('/items', itemsRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on https://lost-and-found-deploy-mu.vercel.app`);
});