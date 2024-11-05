// index.js
// Basic ExpressJS Server
// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");

require('dotenv').config();


// [SECTION] Server setup
const app = express();

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING)

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
const cors = require('cors');
app.use(cors({
	origin: ["http://localhost:3000", /\.vercel\.app$/], // Allow localhost:3000 and any *.vercel.app subdomain
	credentials: true
  }));

//Routes Middleware
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);


if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};