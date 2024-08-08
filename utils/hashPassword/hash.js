const crypto = require('crypto'); 

require('dotenv').config()
const algorithm = 'aes-256-cbc'; // the encryption algorithm to use 
// const key = crypto.randomBytes(32); // generate a random encryption key 
// const iv = crypto.randomBytes(16); // generate a random initialization vector 

// console.log(key);
// console.log(iv);


exports.encrypt = (text) => { 
  // console.log(typeof(process.env.KEY));
  const cipher = crypto.createCipheriv(algorithm,Buffer.from(process.env.KEY, 'hex') ,Buffer.from(process.env.IV, 'hex') ); 
  let encrypted = cipher.update(text, 'utf8', 'hex'); 
  encrypted += cipher.final('hex'); 
  // console.log(typeof(encrypted));
  return encrypted; 
}; 

exports.decrypt = (text) => { 
  const decipher = crypto.createDecipheriv(algorithm,Buffer.from(process.env.KEY, 'hex') ,Buffer.from(process.env.IV, 'hex') ); 
  let decrypted = decipher.update(text, 'hex', 'utf8'); 
  decrypted += decipher.final('utf8'); 
  return decrypted; 
}; 

// const originalText = 'my secret message'; 

// const encryptedText = encrypt(originalText); 
// console.log(`Encrypted text: ${encryptedText}`); 

// const decryptedText = decrypt(encryptedText); 
// console.log(`Decrypted text: ${decryptedText}`);