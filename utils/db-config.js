require("dotenv").config();

const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(chalk.red("Problem while connecting : ", err.message));
      console.log(chalk.yellow(err));
    }
  }
);

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(chalk.red("Something went wrong in DB : ", err.message));
});
db.once("open", () => {
  console.log(chalk.blue("DB Connected"));
});
