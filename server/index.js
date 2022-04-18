const express = require('express');
const app = express();
const path = require('path');


const mockRouter = require('./mock');

app.use('/', mockRouter);
app.listen(9528, () => console.log("listening on port 9528"));