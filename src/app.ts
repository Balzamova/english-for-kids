import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import categories from './routers/category.router';
import cards from './routers/card.router';
import files from './routers/file.router';
import auth from './routers/auth.router';

const PORT = process.env.PORT || 5000;
const mongoURL = 'mongodb+srv://balzam:1q2w3e4r@cluster0.w9yt2.mongodb.net/english-app?retryWrites=true&w=majority';
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

const publicPath = path.join(__dirname, '/root/audio');

app.use('/api/auth', auth);
app.use('/api/static', express.static(publicPath));
app.use('/api/categories', categories);
app.use('/api/cards', cards);
app.use('/api/uploads', files);

async function start() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  } catch (e) {
    console.log('Server Error', e);
    process.exit(1);
  }
}

start();
