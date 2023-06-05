

function arrayToB64(array){

    // Convert the array int32 ini ke Uint8Array, kenapa? karena javascript :(
    const uint8Array = new Uint8Array(array.length * 4);
    // Mengakali agar dari 32 bisa disimpan ke 8 bit
    array.forEach((num, index) => {
        uint8Array[index * 4] = (num >> 24) & 255;
        uint8Array[index * 4 + 1] = (num >> 16) & 255;
        uint8Array[index * 4 + 2] = (num >> 8) & 255;
        uint8Array[index * 4 + 3] = num & 255;
    });

    // Konvert ke string
    const str = String.fromCharCode.apply(null, uint8Array);

    // karena 8 bit akhirnya bisa di convert ke b64
    const base64String = btoa(str);

    return base64String

}

function b64ToArray(base64String){

    // decode string
    const decodedString = atob(base64String);

    // convert ke array int8,
    const uint8Array = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
        uint8Array[i] = decodedString.charCodeAt(i);
    }

    // convert balik ke int32
    const uint32Array = [];
    for (let i = 0; i < uint8Array.length; i += 4) {
    const num = 
        (uint8Array[i] << 24) +
        (uint8Array[i + 1] << 16) +
        (uint8Array[i + 2] << 8) +
        uint8Array[i + 3];
        uint32Array.push(num);
    }

    return uint32Array

}


function pangkatMod(x,p,N){
    // Menghitung x^p mod N
    var A = 1
    var m = p
    var t = x
    
    while( m > 0 ) {
        k = Math.floor( m/2 )
        r = m - 2*k
        if( r == 1 )
            A = mod( A*t, N )
        t = mod( t*t, N )
        m = k
    }			
    return A
}


function fpb(a, h) {

    let temp;
    while (true) {
        temp = a % h;
        if (temp == 0) return h;
        a = h;
        h = temp;
    }
}
    
function modInverse(a, m){

    let m0 = m;
    let y = 0;
    let x = 1;
    
    if (m == 1){
        return 0;
    }

    while (a > 1){
            
        let q = parseInt(a / m);
        let t = m;
    
        m = a % m;
        a = t;
        t = y;
    
        y = x - q * y;
        x = t;
    }
    
    // Ubah x jadi positif
    if (x < 0)
        x += m0;
    
    return x;
}
    

function nilaiKRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();

    rand = Math.floor( rand * difference);

    rand = rand + min;

    return rand;
}

function mod( m, n ){			
    return m - n*Math.floor(m/n)
}
	

module.exports = { pangkatMod, fpb, modInverse, nilaiKRandom, mod , arrayToB64, b64ToArray}