const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const bodyParser = require('body-parser');
const Register = require("./models/register");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(static_path));
app.set("view engine","hbs");

app.get("/", (req, res) => {
    res.render("register")
    
})
app.get("/login", (req, res)=>{
    res.render("login");
})
app.get("/index", (req, res) => {
    res.render("index")
    
})
app.get("/register", (req, res)=>{
    res.render("register");
})
app.listen(port, () => {
    console.log("Server is running at port no ${port}");
})
app.post("/register", async (req, res) => {
    try {
      const { name, email, password, confirm_password } = req.body;
  
      // Check if password and confirm_password match
      if (password !== confirm_password) {
        return res.status(400).render("register", { message: "Passwords do not match" });
      }
  
      // Check if the email is already registered
      const existingUser = await Register.findOne({ email });
      if (existingUser) {
        return res.status(400).render("register", { message: "User already exists!" });
      }
  
      // Create a new user
      const registerUser = new Register({
        name,
        email,
        password,
      });
  
      // Save the user to the database
      const registeredUser = await registerUser.save();
      res.status(201).render("index");
      console.log(registeredUser);
    } catch (error) {
      res.status(400).send(error);
      console.error(error);
    }
  });
  app.post('/index', async (req, res) => { 
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await Register.findOne({ email: email });

        if (user !== null) {
            console.log(user.password); // Move this line here, after checking if user is not null

            if (user.password === password) {
                res.status(201).render('login');
            } else {
                res.render('index', { message: 'Invalid login details' });
            }
        } else {
            res.render('index', { message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).render('index', { message: 'Invalid login details' });
    }
});
const mongoose = require('mongoose');
const dbUrl ="mongodb+srv://anchitasajeev:anchita2002@cluster0.uozkzhb.mongodb.net/"

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
   .connect(dbUrl, connectionParams)
   .then(() => {
    console.log('MongoDB Atlas connected');
  })
  .catch((err) => {
    console.error(err);
  });