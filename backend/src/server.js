require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PORT, CORS_ORIGIN } = require('./config');
const generateRouter = require('./routes/generate');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/api/generate', generateRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend a correr em http://localhost:${PORT}`);
});
