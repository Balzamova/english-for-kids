import { Schema, model } from 'mongoose';

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: false },
  password: { type: String, required: true },
});

export default model('User', schema);
