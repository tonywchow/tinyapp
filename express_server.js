const express = require('express');
const morgan = require('morgan');// Middleware logger
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { generateRandomString, getUserByEmail, AddHttp, urlsForUser } = require('./helpers');
const app = express();
const PORT = 8080; //default port 8080
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey1', 'secretkey2'],
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

//Homepage
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//Viewing all urls
app.get('/urls', (req, res) => {
  if (req.session['user_id']) {
    const templateVars = {
      urls: urlsForUser(req.session['user_id'], urlDatabase),
      user: users[req.session['user_id']],
      error: null
    };
    return res.render('urls_index', templateVars);
  }
  const templateVars = {error:'Please log in to see your URLs', user: null, longURL: null, id:null, urls:null};
  return res.render('urls_index', templateVars);
});

//Create TinyURL: Creating new Short URL from Long URL
app.get('/urls/new', (req, res) => {
  if (req.session['user_id']) {
    const templateVars = {
      user: users[req.session['user_id']]
    };
    return res.render('urls_new',templateVars);
  }
  return res.redirect('/login');
});

/*
This will determine if the short url ID exist,
if it doesnt it will redirect back to the /url page.
If it does exist, it will display the long and short URL
*/
app.get('/urls/:id', (req, res) => {
  if (req.session['user_id']) {
    // The code below confirms the shorten URL belongs to the logged in user
    let userChosenShortenURL = req.params.id;
    if (req.session['user_id'] !== urlDatabase[userChosenShortenURL]['userID']) {
      return res.send('You cannot access a URL that does not belong to you.');
    }
    const templateVars = {
      id: req.params.id,
      longURL: urlsForUser(req.session['user_id'],urlDatabase)[req.params.id]['longURL'],
      user: users[req.session['user_id']]
    };
    let longURL = urlDatabase[req.params.id]['longURL'];
    if (longURL) {
      return res.render('urls_show', templateVars);
    }
    return res.redirect('/urls');
  }
  return res.send('Please login to see your URLs');
  
});

//When the user clicks the short ID, they will be taken to the longURL
app.get('/u/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.send('Shortened URL does not exist');
  }
  const longURL = urlDatabase[req.params.id].longURL;
  return res.redirect(longURL);
});


/*
This post will generate a shortenURLKey
and log it into the database.
It will the redirect you to the URL
*/
app.post('/urls', (req, res) => {
  if (req.session['user_id']) {
    let shortenURLKey = generateRandomString();
    urlDatabase[shortenURLKey] = {
      longURL: AddHttp(req.body.longURL),
      userID: req.session['user_id']
    };
    return res.redirect('/urls');// Redirects you back to the MyURLs
  }
  return res.send('Only registered/logged-in users can shorten URLs');
});

/*
This POST is initiated when the delete
button in urls_index.ejs is clicked
*/
app.post('/urls/:id/delete', (req, res) => {
  if (req.session['user_id']) {
    // The code below confirms the shorten URL belongs to the logged in user
    let userChosenShortenURL = req.params.id;
    if (req.session['user_id'] !== urlDatabase[userChosenShortenURL]['userID']) {
      return res.send('You cannot delete a URL that does not belong to you.');
    }
    delete urlDatabase[userChosenShortenURL];
    return res.redirect('/urls');
  }
  return res.send('Only registered/logged-in users can delete URLs');
});

/*
This POST will retrieve form input from
urls_show.ejs and edits the longURL.
This will also determine whether the link contains 'https://'.
 If not it will add it to the string using function AddHttp()
*/
app.post('/urls/:id/edit', (req, res) => {
  if (req.session['user_id']) {
    // The code below confirms the shorten URL belongs to the logged in user
    let userChosenShortenURL = req.params.id;
    let userInputLongURL = req.body.longURL;
    if (req.session['user_id'] !== urlDatabase[userChosenShortenURL]['userID']) {
      return res.send('This URL does not belong to you.');
    }
    urlDatabase[userChosenShortenURL]['longURL'] = AddHttp(userInputLongURL);
    return res.redirect('/urls');
  }
  return res.send('Only registered/logged-in users can edit URLs');
});

/*
This POST is initiated from urls_index.ejs
when the edit button is clicked
*/
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  return res.redirect(`/urls/${id}`);
});

//Login page
app.get('/login', (req, res) => {
  if (!req.session['user_id']) {
    const templateVars = {user: null};
    return res.render('urls_login', templateVars);
  }
  return res.redirect('/urls');
});

app.post("/login", (req, res) => {
  if (req.body.email.length === 0) {
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
    if (!bcrypt.compareSync(req.body.password, userUniqueID.password)) {
      return res.status(403).send('Incorrect password');
    }
    req.session['user_id'] = userUniqueID.id;
    return res.redirect("/urls");
  }
});


//Logging out
app.post('/logout', (req, res) => {
  req.session = null;
  return res.redirect('/login');
});

//Registering new account page
app.get('/register', (req, res) => {
  if (!req.session['user_id']) {
    const templateVars = { users, user: null };
    return res.render('urls_register', templateVars);
  }
  return res.redirect('/urls');
});
// Logic when user inputs registeration information
app.post('/register', (req, res) => {
  let newUserID = generateRandomString();
  if (req.body.email.length === 0) {
    return res.status(400).send('Please enter login details');
  }
  if (req.body.password.length === 0) {
    return res.status(400).send('Invalid Password');
  }
  if (getUserByEmail(req.body.email, users) === undefined) {
    const password = req.body.password;
    const salt = bcrypt.genSaltSync();
    const hashed = bcrypt.hashSync(password, salt);

    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: hashed,
    };
    req.session['user_id'] = newUserID;
  } else {
    return res.status(400).send('Email already exist');
  }
  return res.redirect('/urls');
});

// Hello page
app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

/* Used to bind and listen to the connection
on the specified host and port
*/
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});