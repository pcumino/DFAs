G1 = function(){
	this.word;
};

G1.prototype.setWord = function(input){
	this.word = input;
	this.res = false;
};

G1.prototype.W = function(){
	console.log('In W');
	this.A();
	console.log('\tafter A: '+this.word);
	this.B();
	console.log('\tafter B: '+this.word);

	console.log("W) this.word: "+this.word);

	return this.res;
};

G1.prototype.A = function(){
	console.log('In A');

	if(this.word[0] != 'a'){
		this.res = false;
		return false;
	}else{
		while(this.word[0] == 'a'){
			this.word = this.word.substring(1);
		}
	}

};

G1.prototype.B = function(){
	console.log('In B');
	while(this.word[0] == 'b'){
		this.word = this.word.substring(1);
	}
};



// if(As == 3){
// 	this.A
// }

// switch (input) {
// 	case 'A':
// 		console.log('A');
// 		break;
// 	case 'B':
// 		console.log('B');
// 		break;
// 	default:
// 		// statements_def
// 		break;
// }
