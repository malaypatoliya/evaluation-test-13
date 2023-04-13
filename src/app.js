const express = require('express');
const setRoutes = require('./setters/routeSetters');
require('dotenv').config();
require("../src/db/models/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setRoutes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server Started on http://localhost:${process.env.PORT}`);
});