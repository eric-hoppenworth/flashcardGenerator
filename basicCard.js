var BasicCard = function (front, back) {
	if (this instanceof BasicCard){
		this.front = front;
		this.back = back;
		this.type = "basic";
	} else{
		return new BasicCard(front, back);
	}
};


module.exports = BasicCard;