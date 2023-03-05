const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; //default port 8080
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
/*
This function will generate a random string with a length of 6
*/
const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
};
 
//Homepage

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//Viewing all urls

app.get('/urls', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render('urls_index', templateVars);
});

//Creating new Short URL from Long URL

app.get('/urls/new', (req, res) => {
  const templateVars = { 
    username: req.cookies['username']
  }
  res.render('urls_new',templateVars);
});

/*
This will determine if the short url ID exist, if it doesnt, it will redirect back to the /url page. If it does exist, it will display the Long and short URL
*/
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['username']
  };
  let longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.render('urls_show', templateVars);
    res.redirect(longURL);
  }
  res.redirect('/urls')
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
This POST is initiated when the delete button in urls_index.ejs is clicked
*/
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})
/*
This POST will retrieve forum input from urls_show.ejs and edits the longURL. This will also determine whether the link contains 'http://'. If not it will add it to the string.
*/
app.post('/urls/:id/edit', (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  if (longURL.includes('http://')) {
    urlDatabase[id] = longURL;
  } else {
    urlDatabase[id] = 'http://' + longURL
  }
  res.redirect('/urls')
})
/*
This POST is initiated from urls_index.ejs when the edit button is clicked
*/
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

//Accepting login username
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});
//Logging out

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});