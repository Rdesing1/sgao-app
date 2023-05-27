const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);

const { dataDB } = require('./keys');

// initialization of routes
const indexRoutes = require('./routes/index.routes.js');
const chargesRoutes = require('./routes/charges.routes.js');
const autchRoutes = require('./routes/auth.routes.js');



// initializactions
const app = express();
require('./lib/passport.js');

// settings 
app.set('port', process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressSession({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(dataDB)
}));

app.use(passport.initialize());
app.use(passport.session());


// globals 


// routes
app.use(indexRoutes);
app.use(chargesRoutes);
app.use(autchRoutes);

// public
app.use(express.static(path.join(__dirname, 'public')));

// listening
app.listen(app.get('port'), () => {
    console.log("server on port " + app.get("port"));
});
