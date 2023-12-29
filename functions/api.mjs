import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import ServerlessHttp from 'serverless-http'

// Routes
import userRoutes from '../routes/userRoutes.js'
import karyawanRoutes from '../routes/karyawanRoutes.js'
import expenseTrackerRoutes from '../routes/expensetrackerRoutes.js'
import jabatanRoutes from '../routes/jabatanRoutes.js'
import kehadiranRoutes from '../routes/kehadiranRoutes.js'
import gajiRoutes from '../routes/gajiRoutes.js'

// setup process.env
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json({limit: "20mb"}));
app.use(cors())

app.use('/', userRoutes);
app.use('/', expenseTrackerRoutes);
app.use('/', karyawanRoutes);
app.use('/', jabatanRoutes);
app.use('/', kehadiranRoutes);
app.use('/', gajiRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});

export default app
export const handler = ServerlessHttp(app);