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

//

const getUserByEmail = (userEmail, database) => {
  for (const item in database) {
    if(database[item].email === userEmail) {
      return database[item];
    }
  }
  return undefined
}

module.exports = { generateRandomString, getUserByEmail }