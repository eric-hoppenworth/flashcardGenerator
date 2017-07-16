var ClozeCard = function(text,cloze){
    if (this instanceof ClozeCard){
        //the new keyword was used.

        //check for the cloze in the text
        if(text.includes(cloze)){
            //if it does, go ahead and create the object
            this.fullText = text;
            this.cloze = cloze;
            this.partialText = text.replace(cloze," ... ");
        }else{
            //if it does not, throw an error
            console.log("Be sure that your text includes the cloze text.");
            return false;
        }



    } else {
        return new ClozeCard(text,cloze);
    }
};

module.exports = ClozeCard;