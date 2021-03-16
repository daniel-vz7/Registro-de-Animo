const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Routes
app.use('/log', require('./routes/logRoutes'));
app.use('/user', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.redirect('/log');
});

// Init app
mongoose.connect('mongodb://localhost:27017/estres', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  try {
    app.listen(8080);
    console.log(`Listening on port ${8080}`);
  } catch (error) {
    console.log(`Error initializing app`);
  }
});