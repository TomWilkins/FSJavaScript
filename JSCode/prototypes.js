http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/

var cl = function(m){console.log(m)};

/* 1. prototype property

Every javascript function has - empty by default
Attach properties and methods onto the prototype property
  when you want to implement inheritance.
Cannot enumerate over prototype properties, but can access using __proto__
*/

var prototypeProperty = (function(){

  var test = function(){

    function PrintStuff(myDocs){
      this.documents = myDocs;
    };

    // add print prototype method
    PrintStuff.prototype.print = function(){
      cl(this.documents);
    }

    var newObj = new PrintStuff("I am an object that can print stuff!");

    newObj.print();

  };

  return{ test : test }

}());

//prototypeProperty.test();


/* 2. Prototype Attribute

Characteristic of the object - tells us the objects parent
Points to the object it inherited from.

Refered to as the prototype object

To get the prototype object call
newObj.prototype


  3. Constructors

Used to initize an object

function MyObject(){

};

var newObj = new MyObject();

Al objects that inherit from another object also inherit a constructor property

cl(newObj.constructor); // MyObject();

Can create an object using a constructor: new Object()
Or as an Object Literal : var myObj = {name : "Tom"};

If an Object is created from an Object Literal. then its prototype object is Object.prototype
If it is creatd from a constructor function, it inherits from that constructor function,
  so its prototype is : <function_name(object)>.prototype

*/

var inheritance = (function(){

  var test = function(){

    // prototype object Plant
    function Plant(){

      // variables
      this.country = "England";
      this.isOrganic = false;
    }

    // functions
    Plant.prototype.showNameAndColour = function(){
      cl("name : " + this.name + " colour : " + this.colour);
    }

    Plant.prototype.amIOrganic = function(){
      cl(this.isOrganic);
    }


    // prototype object Fruit
    function Fruit(name, colour){
      this.name = name;
      this.colour = colour;
    }

    // inherit from Plant
    Fruit.prototype = new Plant();

    var banana = new Fruit("Banana", "Yellow");

    cl("My fruit is a " + banana.name);

    // call inherited method
    banana.showNameAndColour();

  };


  return{
    test : test
  }

}());

inheritance.test();
