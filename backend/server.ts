import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB then start the server
await connectDB();

app.listen(PORT, () => {
  console.log(`Hello API server is listening on http://localhost:${PORT}`);
});
