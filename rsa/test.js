const rsa = require('./rsa')

encrypted_msg = rsa.encrypt('ODI0NTY3LDQyNjgzNDc=', "Asdasda ini")

console.log(encrypted_msg)

decrypt_msg = rsa.decrypt('MjkxMTM2Nyw0MjY4MzQ3', encrypted_msg)

console.log(decrypt_msg)