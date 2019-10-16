import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import storeRoutes from './server/routes/StoreRoutes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

const port = process.env.PORT || 8000;

app.use('/v1/closest', storeRoutes);

app.get('/health', (req, res) => res.status(200).send({
  message: 'GeoLocationServer is healthy',
}));

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
