const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'Akshay@654321', // Replace with your MySQL password
  database: 'referral_db' // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database...');
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akshaykumarmishrraa@gmail.com', // Replace with your Gmail email
    pass: 'Akm@4321' // Replace with your Gmail password
  }
});

// Routes
app.post('/api/referral', (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  // Save referral data to MySQL database
  const sql = 'INSERT INTO referrals (referrer_name, referrer_email, referee_name, referee_email) VALUES (?, ?, ?, ?)';
  db.query(sql, [referrerName, referrerEmail, refereeName, refereeEmail], (err, result) => {
    if (err) {
      console.error('Error saving referral data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('Referral data saved successfully:', result);

    // Send referral email
    const mailOptions = {
      from: 'akshaykumarmishrraa@gmail.com',
      to: refereeEmail,
      subject: 'Referral Invitation',
      text: `Dear ${refereeName},\n\nYou have been referred by ${referrerName} to join our platform.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending referral email:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      console.log('Referral email sent:', info.response);
      res.status(200).json({ message: 'Referral data saved and email sent successfully' });
    });
  });
});

// Root Route Handler
app.get('/', (req, res) => {
  res.send('Welcome to the Referral API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error caught by error handling middleware:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

