var BasicCard = function (front, back) {
	if (this instanceof BasicCard){
		this.front = front;
		this.back = back;
		this.type = "basic";
	} else{
		return new BasicCard(front, back);
	}
};

BasicCard.prototype.draw = function(side){
	if (side != "front" && side != "back"){
		//if you try to print something other than the front or back
		side = "front";
	}
	buildLine(" ","full");
	buildLine("/","full");
	buildLine(" ");
	buildLine(" ");
	buildLine(" ");
	buildLine(" ");
	buildLine(this[side],"center");
	buildLine(" ");
	buildLine(" ");
	buildLine(" ");
	buildLine(" ");
	buildLine("/","full");
	buildLine(" ","full");
};

function buildLine(content = " ",justify = "left"){
	
	const lineWidth = 53;
	const lineLeft = "/      ";
	const lineRight = "      /";
	const trueLineWidth = lineWidth + lineLeft.length + lineRight.length;

	var i = lineWidth;
	var j = 0;


	//if content came in as empyt string, give it a spacebar value
	content = content === "" ? " " : content;
	while(true){
		//check to see if the content is not longer than the current line
		if(content.length <= i){
			var txt = "";
			if(justify === "left"){
				//if it is longer, add remaining spaces to the right side
				txt = lineLeft + content.substring(j) + " ".repeat(i - content.length)+lineRight;
			} else if (justify === "center"){
				//add half of the spaces to the left, and half to the right.  Also, add one extra to the right(if difference is odd)
				txt = lineLeft + " ".repeat((i - content.length)/2) + content.substring(j) + " ".repeat((i - content.length)/2)+" ".repeat((i-content.length)%2)+lineRight;
			} else if (justify === "full"){
				//repeat the provided text without the endings.
				txt = content.repeat(trueLineWidth/content.length);
			}
			console.log(txt);
			break;
		} else{
			//if the content is too long, get a substring
			if(justify === "left" || justify === "center"){
				txt = lineLeft + content.substring(j,i) + lineRight;
			} else if (justify === "full"){
				//do nothing, too big
				txt = "";
			}
			console.log(txt);
		}
		j = i;
		i = i + lineWidth;
	}
}	

module.exports = BasicCard;