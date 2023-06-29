const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

// Create a project and assign it to a user
app.post('/projects', (req, res) => {
  const { projectName, userId } = req.body;
  connection.query('INSERT INTO projects (id,name) VALUES (NULL,?)', [projectName], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Failed to create the project' });
      return;
    }
    const projectId = results.insertId;
    connection.query('INSERT INTO project_assigned (user_id, project_id) VALUES (?, ?)', [userId, projectId], (err) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Failed to assign the project to the user' });
        return;
      }
      res.status(201).json({ projectId, projectName, userId });
    });
  });
});
app.get("/projects", (req,res)=> {
    connection.query("select * from projects" , (err,results )=> {
res.json({projects:results})
    })
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
