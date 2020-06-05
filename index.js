const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// const Users = mongoose.model('Users', {
// 	user: { type: String, default: '' },
// 	total: { type: Number, default: 0 }
// });
// const Expense = mongoose.model('Expense', {
// 	lieu: { type: String, default: '' },
// 	choix: { type: String, default: '' },
// 	montant: { type: Number, default: '' }
// });

const Users = mongoose.model("Users", {
  user: { type: String, default: "" },
  total: { type: Number, default: 0 },
  expense: [
    {
      place: { type: String, default: "" },
      amount: { type: Number, default: 0 },
    },
  ],
});

// **Read**
app.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Create USER**
app.post("/create/user", async (req, res) => {
  try {
    const newUsers = new Users({
      user: req.body.user,
    });
    await newUsers.save();
    res.json({ newUsers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Update**
app.post("/update", async (req, res) => {
  try {
    if (req.body.userID && req.body.amount && req.body.place) {
      const user = await Users.findById(req.body.userID);
      const newExpense = {
        amount: req.body.amount,
        place: req.body.place,
      };
      user.expense.push(newExpense);
      user.total = user.total + parseInt(req.body.amount);
      await user.save();
      res.json({ user });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Delete**
app.post("/delete", async (req, res) => {
  try {
    if (req.body.id) {
      const student = await Student.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      await student.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// app.listen(process.env.PORT || 3600, () => {
app.listen(3600, () => {
  console.log("Server started");
});
