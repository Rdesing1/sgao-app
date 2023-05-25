const express = require('express');
const morgan = require('morgan');
const path = require('path');

const indexRoutes = require('./routes/index.routes.js');
const chargesRoutes = require('./routes/charges.routes.js');
// initializactions
const app = express();


// settings 
app.set('port',process.env.PORT || 3000);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//middleware
app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// globals 


// routes
app.use(indexRoutes);
app.use(chargesRoutes);

// public
app.use(express.static(path.join(__dirname,'public')));

// listening
app.listen(app.get('port'),() =>{
    console.log("server on port " + app.get("port"));
});
