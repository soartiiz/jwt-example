var express = require('express');
var app = express();
const port = 3000
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('dotenv').config()
const jwt = require('jsonwebtoken');

const users = [
  {
    username: 'Soartiz',
    password: 'azerty'
  },
  {
    username: 'Soartiz+1',
    password: 'azerty'
  },
  {
    username: 'Soartiz+2',
    password: 'azerty'
  }
];

const isAuth  = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send('Unauthorized')
  }

  jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { return res.status(401).send('Unauthorized') }

    req.user = user
    next()
  });
}

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/users', isAuth, function(req, res) {
  res.json(users)
});

app.post('/login', (req, res) => {
  const payload = req.body

  const user = users.find(u => u.username === payload.username && u.password === payload.password)

  if (user) {
    const accessToken = generateAccessToken(user)

    res.json({ accessToken, user });
  } else {
    res.send('Credentials incorrect')
  }
})