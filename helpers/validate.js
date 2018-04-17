const _ = require('lodash');

class Validator {
  constructor() {
    this.plates = {};
    this.aForSend = 10;
    this.aForDelete = 100;
  }

  newPlate(plate) {
    if(plates[plate]) {
      plates[plate].count += 1;
    }
    else {

    }
  }
}

class Plate {
  constructor(aForSend, aForDelete) {
    this.plateCount = 1;
    this.totalCount = 1;
    this.aForSend = aForSend || 10;
    this.aForDelete = aForDelete || 100;

    this.plateCountUp = this.plateCountUp.bind(this)
  }
  * plateCountUp() {
    while(this.plateCount < this.aForSend)
      yield this.plateCount++;
  }
  * totalCountUp() {
    while(this.totalCount < this.aForDelete)
      yield this.aForDelete++;
  }
  test() {
    console.log(this.plateCount);
  }
}

const test = new Plate();
const test2 = test.totalCountUp();
console.log(test2.next());
console.log(test2.next());
console.log(test2.next());
console.log(test2.next());
console.log(test2.next());

console.log(test2.next());
console.log(test2.next());
console.log(test2.next());
console.log(test2.next());
console.log(test2.next());
test.test()
console.log(test2.next());
