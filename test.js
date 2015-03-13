var gold = {a:1};

console.log(gold.a); // 1
console.log(gold.z); // undefined

var blue = extend({}, gold); // copy all the propeties from the gold object to the blue object, occur just once

var rose = Object.create(gold); // 1, look up the gold object 

var carl ike = function(){
}



