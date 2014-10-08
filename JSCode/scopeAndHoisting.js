http://javascriptissexy.com/javascript-variable-scope-and-hoisting-explained/

/*

  1. Variable Scope

Variables are either local or global.

JavaScript does not have a block level scope
It has function level scope.

Variables defined within a function can only be accessed there

e.g.

var name = "Tom"; // global level scope

function showName(){
  var name ="Goon!";
  cl(name); // Goon!
}

cl(name); // Tom

Always define local variables before using them.

Local variables have priority over global, therefore if you declare them in the local
  place then it will not change globally (if there is a variable with the same name)

Any variables that are GLOBAL can be used throughout the web application, meaning that
  they can be messed with in other script files.

Any undeclared variables are hoisted to the global scope.

All variables used in the setTimeout function are excluded from the global scope


  2. Hoisting

All variable declarations are hoisted to the top of the context, either a function or global

*/
