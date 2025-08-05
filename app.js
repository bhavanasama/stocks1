const path = require('path');
const express = require('express');
const {connectToDatabase} = require('./config/database');
const cors = require('cors');
const {setRoutes} = require('./routes/index'); 


const app = express();
const PORT = 4050;
// process.env.PORT || 3000;


app.use(cors());


app.use(express.json());


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view.html'));
//   });

// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'view.html')); // ✅ Correct
//   });
//important

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'src/code')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'code', 'main.html')); // ✅ Correct
//   });

app.use(express.static(path.join(__dirname, 'code')));

// Optional: Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'code', 'main.html')); // ✅ Correct
  });

connectToDatabase()
    .then(() => {
        console.log('Connected to the database.');
        setRoutes(app);
        
        app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });