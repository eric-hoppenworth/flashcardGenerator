var inquirer = require("inquirer");
var ClozeCard = require("./clozeCard.js");
var BasicCard = require("./basicCard.js");

var myCard = ClozeCard("This is text","not");

console.log(myCard);