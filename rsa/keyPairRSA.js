
const {  fpb, modInverse, nilaiKRandom, mod } = require('./helpers');

p = 2063
q = 2069


function buatKeypair(p, q){
    
    // cari nilai n
    n = p * q

    // Phi is the totient of n
    phi = (p-1) * (q-1)

    // cari nilai k
    e = nilaiKRandom(1, phi)
    

    // check e dan phi adalah co prime
    g = fpb(e, phi)
    
    while (g != 1){
        
        e = nilaiKRandom(1, phi)
        g = fpb(e, phi)
    }

    // buat private key
    d = modInverse(e, phi)

    // console.log('e:' + e)
    // console.log('d:' + d)
    // console.log('N:' + n)
    // console.log('phi:' + phi)
    // console.log('g:' + g)
  
    // return public dan private key
    return [[e, n], [d, n]]
}



const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let keyPair

rl.question("Masukkan nilai p ? ", function(p) {
    rl.question("Masukkan nilai q? ", function(q) {
        console.log('Membuat key pair.......');
        keyPair =  buatKeypair(p,q)
        rl.close();
    });
});

rl.on("close", function() {
    console.log('\n============== Key Generated ================\n')
    console.log(`N : ${keyPair[0][1]}`)
    console.log(`Public key : ${btoa(keyPair[0])}`)
    console.log(`Private key : ${btoa(keyPair[1])}`)
    console.log("Key Generated silahkan digunakan! 😎");
    console.log('\n=============================================\n')
    process.exit(0);
});
