const express = require('express');
const morgan = require('morgan');// Middleware logger
const cookieParser = require('cookie-parser');
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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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
    user: users[req.cookies['user_id']]
  };
  res.render('urls_index', templateVars);
});

//Creating new Short URL from Long URL
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_new',templateVars);
});

/*
This will determine if the short url ID exist, if it doesnt, it will redirect back to the /url page. If it does exist, it will display the Long and short URL
*/
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies['user_id']]
  };
  let longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.render('urls_show', templateVars);
    res.redirect(longURL);
  }
  res.redirect('/urls');
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
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

/*
This POST will retrieve form input from urls_show.ejs and edits the longURL. This will also determine whether the link contains 'http://'. If not it will add it to the string.
*/
app.post('/urls/:id/edit', (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  if (longURL.includes('http://')) {
    urlDatabase[id] = longURL;
  } else {
    urlDatabase[id] = 'http://' + longURL;
  }
  res.redirect('/urls');
});

/*
This POST is initiated from urls_index.ejs when the edit button is clicked
*/
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

//Accepting login username
app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.user_id);//loop through array to find user
  res.redirect("/urls");
});

//Logging out
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//Email and password form

app.get('/register', (req, res) => {
  const templateVars = { users };
  res.render('urls_register', templateVars)
});

app.post('/register', (req, res) => {
  const newUserID = generateRandomString();
  users[newUserID] = {
         
    id: newUserID,
    email: req.body.email,
    password: req.body.password

  }
  res.cookie('user_id', newUserID)
  console.log(users)
  console.log(req.cookies['user_id'])
  res.redirect('/urls')
})


app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

//Used to bind and listen to the connection on the specified host and port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});