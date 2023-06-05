
const { pangkatMod, arrayToB64, b64ToArray } = require('./helpers');

function encrypt(pk, plaintext){
    // Ambil key dan N
    let pkDec = atob(pk).split(',')
    let key = pkDec[0]
    let n = pkDec[1]

    cipher = []
    
     // mengiterasi string dan encrypt dengan public key a^b mod m

    for (var i = 0; i < plaintext.length; i++) {
        cipher.push(pangkatMod(plaintext.charCodeAt(i) ,key,n))
    }

    // Convert array chipher ke base64
    var b64encoded = arrayToB64(cipher);
    
    return b64encoded
}
  

function decrypt(pk, ciphertext){

    // Decode base64
    // var theText = atob(ciphertext)
    var theText = b64ToArray(ciphertext)
    let pkDec = atob(pk).split(',')
    let key = pkDec[0]
    let n = pkDec[1]

    plain = []

    // Decrypt ke plaintext dengan  a^b mod m

    for (var i = 0; i < theText.length; i++) {
        plain.push(String.fromCharCode(pangkatMod(theText[i],key,n )))
       
      }

    // Mengembalikan nilai array ke string
    return plain.join("")
    
    }
    
function encryptedObjectValues(obj, public_key) {
    const encryptedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const encryptedValue = encrypt(public_key, value);
        encryptedObj[key] = encryptedValue;
        }
    }
    return encryptedObj;
}



function decryptedObjectValues(obj, privateKey) {
    const decryptedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const decryptedValue = decrypt(privateKey, value);
        decryptedObj[key] = decryptedValue;
        console.log({key: decryptedObj[key]})
      }
    }
    return decryptedObj;
  }

module.exports = {encrypt, decrypt, encryptedObjectValues, decryptedObjectValues}