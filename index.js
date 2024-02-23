// index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors=require("cors");
require("dotenv").config()
const app = express();
const port = process.env.PORT;
app.use(cors())
// Connect to MongoDB
mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schema and model for audio files
const audioSchema = new mongoose.Schema({
  filename: String,
  path: String
});

const Audio = mongoose.model('Audio', audioSchema);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define routes
app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const audio = new Audio({ filename, path });
    await audio.save();
    res.send('Audio uploaded successfully');
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/files', async (req, res) => {
  try {
    const audioFiles = await Audio.find();
    res.json(audioFiles);
  } catch (error) {
    console.error('Error fetching audio files:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
