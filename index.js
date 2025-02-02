const express = require('express')
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require("path");
const app = express()
const port = 3000
app.use(express.static('public_html'))


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Setup MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Set your MySQL password
    database: "photography"
});
db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

// Express-session setup
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true
}));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

// Wiki route
// Wiki Route
app.get('/wiki', (req, res) => {
    res.render('wiki');
});



// --- AUTHEN. ROUTES ---
// Login render
app.get("/login", (req, res) => {
    res.render("login");
});
// Login handle
app.post("/login", async (req, res) => {
    const { username, password, legacy } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).send("<script>alert('Database error. Please try again later.'); window.location='/login';</script>");
        }

        if (results.length === 0) {
            return res.send("<script>alert('❌ User not found.'); window.location='/login';</script>");
        }

        const user = results[0];
        let passwordMatches = false;

        if (legacy === "true") {
            // Allow plaintext comparison for legacy users
            passwordMatches = password === user.password;
        } else {
            // Use bcrypt comparison for users with hashed passwords
            passwordMatches = await bcrypt.compare(password, user.password);
        }

        if (passwordMatches) {
            req.session.user = user;
            return res.redirect("/gallery");
        } else {
            return res.send("<script>alert('❌ Invalid credentials.'); window.location='/login';</script>");
        }
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

//Password change routes
app.get('/change_password', (req, res) => {
    res.render('change_password');
});
// Handle Password Update
app.post('/change_password', (req, res) => {
    const { username, current_password, new_password, old_password } = req.body;

    db.query("SELECT password FROM users WHERE username = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).send("<script>alert('Database error. Please try again later.'); window.location='/change_password';</script>");
        }

        if (results.length === 0) {
            return res.send("<script>alert('❌ User not found. Please check your username.'); window.location='/change_password';</script>");
        }

        const storedHash = results[0].password;

        let passwordMatches;
        if (old_password) {
            passwordMatches = storedHash === current_password;
        } else {
            passwordMatches = await bcrypt.compare(current_password, storedHash);
        }

        if (!passwordMatches) {
            return res.send("<script>alert('❌ Incorrect current password.'); window.location='/change_password';</script>");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        db.query("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username], (updateErr) => {
            if (updateErr) {
                console.error("❌ Error updating password:", updateErr);
                return res.status(500).send("<script>alert('Error updating password. Please try again.'); window.location='/change_password';</script>");
            }
            res.send("<script>alert('✅ Password updated successfully!'); window.location='/';</script>");
        });
    });
});


// --- GALLERY ROUTES ---
// Gallery Page
app.get('/gallery', (req, res) => {
  const searchQuery = req.query.search || "";
  const selectedTag = req.query.tag || "";

  // Having to find a workaround as otherwise the page wouldn't load the first time before tags
  let sql = "SELECT * FROM images WHERE 1=1";
  let params = [];

  //Old name search removed in favour of tag only

  
  // Like opertaor helping with multi tag
  if (selectedTag) {
      sql += " AND tags LIKE ?";
      params.push(`%${selectedTag}%`);
  }

  db.query(sql, params, (err, results) => {
      if (err) {
          console.error("Error fetching gallery:", err);
          return res.status(500).send("Database error");
      }
      res.render('gallery', { images: results, searchQuery });
  });
});



app.get('/form', (req, res) => {
  res.render('form'); // This renders form.ejs
});
// Insert Image into MySQL
app.post('/add-image', (req, res) => {
  const { name, tags, image_url } = req.body;

  if (!name || !tags || !image_url) {
      return res.send('All fields are required!');
  }

  const query = 'INSERT INTO images (imgname, tags, image_url) VALUES (?, ?, ?)';
  db.query(query, [name, tags, image_url], (err, result) => {
      if (err) {
          console.error('Error inserting image:', err);
          res.send('Database error');
      } else {
          res.send('Image added successfully! <a href="/">Go back</a>');
      }
  });
});








// Error Handling Middleware
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  res.status(errorStatus).send(`<h3>${errorStatus}: ${error.toString()}</h3>`);
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Not Found</h1>
    <p>The resource you requested could not be found.</p>
  `);
});

// Tell our application to listen to requests at port 3000 on the localhost
app.listen(port, ()=> {
  console.log(`Web server running at: http://localhost:${port}`)
  console.log(`Type Ctrl+C to shut down the web server`)
})

