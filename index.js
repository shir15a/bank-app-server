const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

const app = express();
app.use(cors())


const transactionsRoute = require('./routes/transactions.routs');
const accountRouter = require("./routes/accounts.routs");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/bank/transactions',transactionsRoute);
app.use('/api/bank/account',accountRouter);

const uri = "mongodb+srv://shira:FLWehXe93lmUqxs2@shira.gviqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connect");
  });

app.listen(process.env.PORT || 8000, () => {
  console.log(`Application start at ${process.env.PORT || 8000}`);
})

