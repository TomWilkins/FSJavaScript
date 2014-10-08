http://javascriptissexy.com/javascript-objects-in-detail/

var cl = function(m){console.log(m)};

// 1. constructor pattern for creating objects
// encapsualtes all the functionalility and characteristics into a single function
var constructorPattern = (function(){

  var Fruit = function(theColour, theSweetness, theFruitName, theNativeToLand){
    this.colour = theColour;
    this.sweetness = theSweetness;
    this.fruitName = theFruitName;
    this.nativeToLand = theNativeToLand;

    this.showName = function(){
      console.log("this is a "+this.fruitName);
    };

    this.nativeTo = function(){
      this.nativeToLand.forEach(function(eachCountry){
        console.log("grown in: " + eachCountry);
      });
    }
  }

  var Test = function(){

    var mangoFruit = new Fruit ("Yellow", 8, "Mango", ["South America", "Central America", "West Africa"]);
    mangoFruit.showName(); // This is a Mango.​
    mangoFruit.nativeTo();

    var pineappleFruit = new Fruit ("Brown", 5, "Pineapple", ["United States"]);
    pineappleFruit.showName(); // This is a Pineapple.
  }

  return{
    makeFruit : Fruit,
    test : Test
  };

}());

//constructorPattern.test();


// 2. Prototype Pattern for creating objects

var prototypePattern = (function(){


  function Fruit(){

  }

  Fruit.prototype.color = "Green";
  Fruit.prototype.sweetness = 7;
  Fruit.prototype.fruitName = "Generic Fruit";
  Fruit.prototype.nativeToLand = "USA";

  Fruit.prototype.showName = function(){
    console.log("This is a " + this.fruitName);
  }

  Fruit.prototype.nativeTo = function(){
    console.log("grown in" + this.nativeToLand);
  }

  var test = function(){
    var mangoFruit = new Fruit ();
    mangoFruit.showName();
    mangoFruit.nativeTo();
    mangoFruit.fruitName = "Orange";
    mangoFruit.showName();
  };

  return{
    test : test
  };

}());

//prototypePattern.test();


// 3. own and inherited properties

var ownAndInheritedProperties = (function(){

  var test = function(){

    var school = {schoolName : "UEA"};

    console.log("schoolName" in school);

    console.log("schoolType" in school);

    console.log("does school have own property schoolName? " +
      school.hasOwnProperty("schoolName"));

    console.log("does school have own property toString? " +
      school.hasOwnProperty("toString"));

    school = {schoolName:"MIT", schoolAccredited: true, schoolLocation:"Massachusetts"};

    for(var eachItem in school){
      console.log(eachItem);
    };

    function HigherLearning(){
      this.educationLevel = "University";
    }

    school = new HigherLearning();
    school.schoolName = "UEA";
    school.schoolAccredited = true;
    school.schoolLocaiton = "Norwich";

    // inherited properties are enumerable

    for(var eachItem in school){
      console.log(eachItem);
    };

    // you can only detele an objects own properties
    // to delete inherited properties, delete them off the prototype

    var christmasList = {mike : "book", jason : "sweater"};
    delete christmasList.mike;

    for (var people in christmasList){
      console.log(people);
    }

    delete christmasList.toString;

    console.log(christmasList.toString());

    cl(school.hasOwnProperty("educationLevel"));

    delete school.educationLevel

    cl(school.educationLevel);

    var newSchool = new HigherLearning();
    cl(newSchool.educationLevel);

    HigherLearning.prototype.educationLevel2 = "University 2";
    cl(school.hasOwnProperty("educationLevel2"));
    cl(school.educationLevel2);

    delete school.educationLevel2;
    cl(school.educationLevel2);
  }

  return{
    test : test
  };

}());

//ownAndInheritedProperties.test();


// 3. Serialize and Deserilize Objects

var serializeAndDeserilizeObjects = (function(){

  var test = function(){

    var christmasList = {mile : "book", jason : "sweater", bob : "bear", tom : "iPhone 6"};

    // print singified object plain
    cl(JSON.stringify(christmasList));

    // print json stringified object with formatting
    cl(JSON.stringify(christmasList, null, 4));

  };

  return{
    test : test
  };

}());


serializeAndDeserilizeObjects.test();
