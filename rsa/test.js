const rsa = require('./rsa')

encrypted_msg = rsa.encrypt('ODI0NTY3LDQyNjgzNDc=', "Test RSA")

console.log(encrypted_msg) // ADgt1QANQywAKo86ADgtoAAtICsADhRGABqmVgAS2Ww=

decrypt_msg = rsa.decrypt('MjkxMTM2Nyw0MjY4MzQ3', encrypted_msg)

console.log(decrypt_msg) // Test RSA