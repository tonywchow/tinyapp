// Generate random unique string with a length of 6
const generateRandomString = () => {
  const uniqueChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let uniqueString = ''
  for (let i = 0; i < 6; i++) {
    let randomPointer = Math.floor(Math.random() * (uniqueChars.length - 1)) 
    uniqueString += uniqueChars[randomPointer]
  }
  return uniqueString;
};

//Loops through object to find user email

const getUserByEmail = (userEmail, database) => {
  for (const item in database) {
    if(database[item].email === userEmail) {
      return database[item];
    }
  }
  return undefined
}

//Adds https:// to link if it is not already in the string

const AddHttp = (link) => {
  if (link.includes('http://')) {
    return link;
  }
  if (link.includes('https://')) {
    return link;
  }
  return link = 'https://' + link;
}

// Compares user input ID to user ID in database. If there is a match, it will return an object with the user's longURL

const urlsForUser = (id, database) => {
  const userURLs = { }
  for (const key in database) {
    if (database[key]['userID'] !== id) {
      userURLs[key] = {
        longURL: database[key]['longURL'],
        userID: null
      } 
    userURLs[key] = {
      longURL: database[key]['longURL'],
      userID: id
      }
    }
  }
  return userURLs;
};

module.exports = { generateRandomString, getUserByEmail, AddHttp, urlsForUser }