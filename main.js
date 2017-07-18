const inquirer = require("inquirer");
const ClozeCard = require("./clozeCard.js");
const BasicCard = require("./basicCard.js");
const fs = require('fs');

var myDeck = [];
var fileName = "";


//On load, show a menu:
firstMenu();

//////////////////////////////////////
/////////     MENUS       ////////////
//////////////////////////////////////


function firstMenu(){
	inquirer.prompt([
			{
				name: "menuOption",
				message: "Welcome to FlashCards.  Please Make a selection.",
				type: "list",
				choices: ["New Deck","Load Deck","Exit"]
			}
		])
	.then(function(response){
		//
		if (response.menuOption === "New Deck"){
		//new deck
		//user will be asked for a file name, and the new cards created will be added to that file.
			newDeck();
		} else if (response.menuOption === "Load Deck"){
		//load deck
		//user will be asked for a file name, and the card deck will be loaded from that file.
			loadDeck();
		} else {
			//exit the application
			return false;
		}
	});
}


//next, the user will choose from the following options:
function secondMenu(){
	inquirer.prompt([
			{
				name: "menuOption",
				message: "What would you like to do?",
				type: "list",
				choices: ["Add Basic Card","Add Cloze Card","Remove Card","Start Quiz","Go Back","Exit"]
			}
		])
	.then(function(response){
		if(response.menuOption === "Add Basic Card"){
			//create Basic Card
				//prompts user for a front and back text.
			addBasicCard(myDeck);
		} else if(response.menuOption === "Add Cloze Card"){
			//create Cloze Card
				//prompts user for front text and a cloze(must be part of full text)
			addClozeCard(myDeck);
		}else if(response.menuOption === "Remove Card"){
			//?remove card
				//list out cards and choose one to destroy
		}else if(response.menuOption === "Start Quiz"){
			//quiz
				//loop thru the cards and ask for input on each card.
			if(myDeck.length === 0){
				//do not start the quiz
				console.log("This deck has no cards in it");
				secondMenu();
			} else{
				startQuiz(0);
			}
		}else if(response.menuOption === "Go Back"){
			//back
				//return to the previous menu
			myDeck = {};
			firstMenu();
		}else if(response.menuOption === "Exit"){
			//exit 
				//quit the application
			return false;
		}
	});
}


///////////////////////////////////////
////////         ACTIONS       ////////
///////////////////////////////////////

function newDeck(){
	//ask user for a file name
	inquirer.prompt([
			{
				name: "fileName",
				message: "What is the name of the deck?(include .txt at the end)",
				type: "input"
			}
		])
	.then(function(response){
		fileName = response.fileName;
		if (fileName.includes(".txt")){
			//everything is fine
		} else {
			console.log("\n");
			console.log("be sure to end your name with '.txt' ");
			console.log("\n");
			firstMenu();
			return false;
		}
		fs.readFile(fileName,"utf8",function(error,data){
			if (!error){
				console.log("\n");
				console.log("A file with that name already exists.  Choose another Name");
				console.log("\n");
				firstMenu();
				return false;
			} else {
				//create deck and move to second menu
				myDeck = [];
				secondMenu();
			}
		})
	});
}

function loadDeck(){
	inquirer.prompt([
			{
				name: "fileName",
				message: "What is the name of the file you would like to load? (include '.txt' at the end)",
				type: "input"
			}
		])
	.then(function(response){
		fileName = response.fileName;
		fs.readFile(fileName,"utf8",function(error,data){

			if (error){
				console.log("\n");
				console.log("No file with that name was found");
				console.log("\n");
				//return to the first menu
				firstMenu();
			} else{
				var loadedDeck = JSON.parse(data);
				//loop thru and restablish object Type and methods
				for (var i = 0;i<loadedDeck.length;i++){
					if(loadedDeck[i].type === "basic"){
						let newCard = new BasicCard(loadedDeck[i].front, loadedDeck[i].back);
						myDeck.push(newCard);
					} else if (loadedDeck[i].type === "cloze"){
						let newCard = new ClozeCard(loadedDeck[i].fullText,loadedDeck[i].cloze);
						myDeck.push(newCard);
					}
				}
				//go to the second menu
				secondMenu();
			}
		})
	});
}

function addBasicCard(deck){
	inquirer.prompt([
			{
				name: "cardFront",
				message: "What goes on the front of the card?(question)",
				type: "input"
			},{
				name: "cardBack",
				message: "What goes on the back of the card?(answer)",
				type: "input"
			}
		])
	.then(function(response){
		//add to the deck
		deck.push(new BasicCard(response.cardFront,response.cardBack));
		//save the deck
		fs.writeFile(fileName,JSON.stringify(deck),function(error){
			console.log("\n"+"Card sucessfully added"+"\n");
			secondMenu();
		});
	});
}

function addClozeCard(deck){
	inquirer.prompt([
			{
				name: "fullText",
				message: "What is the full text, before removal?(answer)",
				type: "input"
			},{
				name: "clozeText",
				message: "What gets removed? (Be sure that the capitaization and spelling matches exactly)",
				type: "input"
			}
		])
	.then(function(response){
		//make sure the cloze text is there
		if(response.fullText.includes(response.clozeText)){
			//everything is fine
			//add to the deck
			deck.push(new ClozeCard(response.fullText,response.clozeText));
			//save the deck
			fs.writeFile(fileName,JSON.stringify(deck),function(error){
				console.log("\n"+"Card sucessfully added"+"\n");
				secondMenu();
			});
		} else {
			//it wasnt there
			console.log("\n");
			console.log("WARNING: Card not added.")
			console.log("Be sure that your removed text is in the full text.");
			console.log("\n");
			secondMenu();
		}
	});
}

function startQuiz(index){
	if (index >= myDeck.length){
		console.log("\n"+"DONE!"+"\n");
		secondMenu();
		return false;
	}
	let myCard = myDeck[index];
	myCard.draw('front');

	inquirer.prompt([
		{
			name: "ready",
			message:"Press Enter to continue",
			type: "input"
		}
	]).then(function(response){
		console.log("*****  ANSWER  *****");
		myCard.draw('back');
		startQuiz(index+1);
	});
}

