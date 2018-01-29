const express = require('express');
const app = express();


app.get('/test', (req, res) => {
  console.log(req.body);
  res.send('hi');
})

app.listen(3002)
