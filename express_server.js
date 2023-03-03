const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});
/*
Displays the long and short URL.
*/
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render('urls_show', templateVars);
});
/*
This post will generate a shortenURLKey and log it into the database. It will the redirect you to the URL
*/
app.post('/urls', (req, res) => {
  console.log(req.body);// Log the POST request body to the console
  let shortenURLKey = generateRandomString();
  urlDatabase[shortenURLKey] = req.body.longURL;
  res.redirect(`/urls/${shortenURLKey}`);// Redirects you to the shortenURLKey
});
/*
This will determine if the short url ID exist, if it doesnt, it will throw an error block to a new urls_error.ejs file i created specifcally made for errors.
*/
app.get('/u/:id', (req, res) => {
  let longURL = urlDatabase[req.params.id];
  if (longURL !== undefined) {
    res.redirect(longURL);
  } else {
    res.render('urls_error', {Error: 'block'});
  }
});

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});