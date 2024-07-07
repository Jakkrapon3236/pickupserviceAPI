const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // เปิดใช้งาน CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pickupservice',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/api/package-details', (req, res) => {
    const query = 'SELECT * FROM `package_detail`';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        res.json(results);
    });
});

app.get('/api/user-table', (req, res) => {
    const query = 'SELECT * FROM `user_pickup` INNER JOIN user_service where user_pickup.userv_id = user_service.userv_id;';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }

        res.json(results);
    });
});


// Insert data into user_pickup table
app.post('/api/pickup', (req, res) => {
  const { userv_id,userp_quantity, userp_date, userp_package, userp_image, userp_status } = req.body;
  
  const sql = 'INSERT INTO user_pickup (userv_id, userp_date, userp_package,userp_quantity, userp_image, userp_status) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [userv_id, userp_date, userp_package,userp_quantity, userp_image, userp_status];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database insert error');
      return;
    }
    res.status(200).send('Data inserted successfully');
  });
});

app.post('/api/service', (req, res) => {
    const {user_id, userv_name, userv_tel, userv_letlong, userv_address, userv_detail } = req.body;
    
    const sql = 'INSERT INTO user_service (user_id,userv_name, userv_tel, userv_letlong, userv_address, userv_detail) VALUES (?,?, ?, ?, ?, ?)';
    const values = [user_id,userv_name, userv_tel, userv_letlong, userv_address, userv_detail];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Database insert error');
        return;
      }
      const userv_id = result.insertId;
      res.status(200).json({ userv_id }); // Send userv_id back as JSON response
    });
  });



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
