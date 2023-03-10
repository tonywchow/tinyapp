const express = require('express');
const morgan = require('morgan');// Middleware logger
const cookieParser = require('cookie-parser');
const { generateRandomString, getUserByEmail, AddHttp } = require('./helper');
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
  testid: {
    id: "testid",
    email: "hello@gmail.com",
    password: "hello",
  },
};

/*
This function will generate a random string with a length of 6
*/
 
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
  if (req.cookies['user_id']) {
    const templateVars = {
      user: users[req.cookies['user_id']]
    };
    res.render('urls_new',templateVars);
  }
  res.redirect('/login')
});

/*
This will determine if the short url ID exist, if it doesnt, it will redirect back to the /url page. If it does exist, it will display the Long and short URL
*/
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: AddHttp(urlDatabase[req.params.id]),
    user: users[req.cookies['user_id']]
  };
  let longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.render('urls_show', templateVars);
    res.redirect(longURL);
  }
  res.redirect('/urls');
});

//When the user clicks the short ID, they will be taken to the longURL

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL)
})


/*
This post will generate a shortenURLKey and log it into the database. It will the redirect you to the URL
*/
app.post('/urls', (req, res) => {
  if (req.cookies['user_id']) {
    let shortenURLKey = generateRandomString();
    urlDatabase[shortenURLKey] = req.body.longURL;
    res.redirect(`/urls/${shortenURLKey}`);// Redirects you to the shortenURLKey
  }
  res.send('Only registered/logged-in users can shorten URLs')
});

/*
This POST is initiated when the delete button in urls_index.ejs is clicked
*/
app.post('/urls/:id/delete', (req, res) => {
  if (req.cookies['user_id']) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  }
  res.send('Only registered/logged-in users can delete URLs')
});

/*
This POST will retrieve form input from urls_show.ejs and edits the longURL. This will also determine whether the link contains 'https://'. If not it will add it to the string using function AddHttp()
*/
app.post('/urls/:id/edit', (req, res) => {
  if (req.cookies['user_id']) {
    const id = req.params.id;
    const longURL = req.body.longURL;
    urlDatabase[id] = AddHttp(longURL);
    res.redirect('/urls');
  }
  res.send('Only registered/logged-in users can edit URLs')
});

/*
This POST is initiated from urls_index.ejs when the edit button is clicked
*/
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

//Login page
app.get('/login', (req, res) => {
  if (!req.cookies['user_id']) {
    const templateVars = {user: null};
    res.render('urls_login', templateVars);
  }
  res.redirect('/urls')
});

app.post("/login", (req, res) => {
  if (req.body.email.length === 0) {
    // res.redirect('/login')
    return res.status(400).send('Please enter login details');
  }
  if (req.body.password.length === 0) {
    return res.status(400).send('Invalid Password');
  }
  const userUniqueID = getUserByEmail(req.body.email, users);
  if (userUniqueID === undefined) {
    return res.status(403).send('Email does not exist');
  }
  if (userUniqueID) {
    if (userUniqueID.password !== req.body.password) {
      return res.status(403).send('Incorrect password');
    }
  }
  console.log(users.userUniqueID);
  res.cookie("user_id", userUniqueID.id);
  res.redirect("/urls");
});


//Logging out
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//Registering new email
app.get('/register', (req, res) => {
  if (!req.cookies['user_id']) {
    const templateVars = { users, user: null };
    res.render('urls_register', templateVars);
  }
  res.redirect('/urls')
});

app.post('/register', (req, res) => {
  let newUserID = generateRandomString();
  if (req.body.email.length === 0) {
    res.status(400).send('Please enter login details');
  }
  if (req.body.password.length === 0) {
    res.status(400).send('Invalid Password');
  }
  if (getUserByEmail(req.body.email, users) === undefined) {
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: req.body.password,
    };
    res.cookie('user_id', newUserID);
  } else {
    res.status(400).send('Email already exist');
  }
  console.log(users);
  res.redirect('/urls');
});


app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

//Used to bind and listen to the connection on the specified host and port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});