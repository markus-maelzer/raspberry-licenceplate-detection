const _ = require('lodash');

class Validator {
  constructor() {
    this.plates = {};
    this.aForSend = 10;
    this.aForDelete = 100;
  }

  setPlate(plate) {
    if(!plate) return;
    if(this.plates[plate]) {
      this.checkPlate(plate, this.plates[plate].countPlate.next());
    }
    else {
      this.plates[plate] = new Plate(this.aForSend, this.aForDelete);
      this.plates[plate].init();
      this.addToTotalCount();
    }
  }

  checkPlate(plate, {value, done}) {
    // console.log('Value-Done', value, done);
    // console.log('Plate: ', plate);
    // console.log('Plates: ', this.plates);
    if(done){
      delete this.plates[plate];
      return false;
    };
  }

  addToTotalCount() {
    _.forIn(this.plates, (value, key) => {

    })
  }
}

class Plate {
  constructor(aForSend, aForDelete) {
    this.plateCount = 1;
    this.totalCount = 1;
    this.aForSend = aForSend || 10;
    this.aForDelete = aForDelete || 100;
  }
  * plateCountUp() {
    while(this.plateCount < this.aForSend)
      yield this.plateCount++;
  }
  * totalCountUp() {
    while(this.totalCount < this.aForDelete)
      yield this.totalCount++;
  }
  init() {
    this.countPlate = this.plateCountUp();
    this.countTotal = this.totalCountUp();
  }
}

const validator = new Validator();

const plates2 = [
  'test1', 'test2', 'test3', 'test4', 'test5',
  'test6', 'test7', 'test8', 'test9', 'test10',
  'test11', 'test12', 'test13', 'test14', 'test15',
  'test16', 'test17', 'test18', 'test19', 'test20'
]

setInterval(function () {
  validator.setPlate(plates2[Math.floor(Math.random() * 5)]);
}, 500);

// make it count for all plates on totalCount

// send nudes when countPlate() returns true

// fix delete shit >_>
