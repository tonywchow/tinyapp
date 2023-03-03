const e = require('express');
const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8)
}

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

app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id]
  };
  res.render('urls_show', templateVars)
});

app.post('/urls', (req, res) => {
  console.log(req.body);// Log the POST request body to the console
  let shortenURLKey = generateRandomString()
  urlDatabase[shortenURLKey] = req.body.longURL
  res.redirect(`/urls/${shortenURLKey}`);// Respond with 'Ok' (we will replace this)
});

app.get('/u/:id', (req, res) => {
  longURL = urlDatabase[req.params.id]
  res.redirect(longURL)
})

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});