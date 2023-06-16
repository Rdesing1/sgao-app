const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);

const { dataDB } = require('./keys');

// initialization of routes
const indexRoutes = require('./routes/index.routes.js');
const autchRoutes = require('./routes/auth.routes.js');
const chargesRoutes = require('./routes/charges.routes.js');
const employessRoutes = require('./routes/employess.routes.js');
const coreRoutes = require("./routes/core.routes.js");
const circuitRoutes = require("./routes/circuit.routes.js");
const assingRoutes = require("./routes/assign.routes.js");

// initialization of routes the vigilants
const assignedRoutes = require('./routes/assignedOrder.routes.js');

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
app.use((req,res,next) =>{
    app.locals.user = req.user;
    next();
});

// routes
app.use(indexRoutes);
app.use(autchRoutes);
app.use(chargesRoutes);
app.use(employessRoutes);
app.use(coreRoutes);
app.use(circuitRoutes);
app.use(assingRoutes);

// routes of level 3 
app.use(assignedRoutes);
// public
app.use(express.static(path.join(__dirname, 'public')));

// listening
app.listen(app.get('port'), () => {
    console.log("server on port " + app.get("port"));
});
