// Mesmo código apresentado nas implementações do HM03 porém adaptando o uso de pilha
// pilha sempre inicia com Z empilhado
stackDFA = function(){
	this.input = "";
	this.transdutor = "";
	this.stack = ['Z'];
};

stackDFA.prototype.run = function(input){
	console.log("Running \""+input+"\"");
	this.q0(input);
};

stackDFA.prototype.machineStates = [];
stackDFA.prototype.alphabet = [];

stackDFA.prototype.addState = function(state){
	this.machineStates.push(state);
	for(var i = 0; i < state.transitions.length; i++){
		if(!isInAlphabet(state.transitions[i].letter, this.alphabet)){
			this.alphabet.push(state.transitions[i].letter);
		}
	}
	Object.defineProperty(this,state.name,{
		value: function(subs){
			if((subs.length < 1 &&
				state.isFinal &&
				this.stack.length <= 0)){
				console.log("Stop at "+state.name+" "+state.isFinal);
				return this.Success(subs.length);
				return true;
			}
			else if(subs.length < 1 && !state.isFinal){
				console.log("Stop at "+state.name);
				return this.Fail("\""+state.name+"\" not final state");
				return false;
			}

			console.log("Current state: "+state.name+";");
			this.print("\""+subs+"\""+"\n");
			// this.print("\""+subs.substring(0,subs.length-1)+"\""+"\n");
			this.print("\tCurrent state: "+state.name+";");

			currentLetter = subs[0];
			newsubs = subs.substring(1,subs.length);

			// this.output += state.transitions.output;

			if(!isInAlphabet(currentLetter,this.alphabet)){
				return this.Fail(currentLetter+" not in "+this.alphabet);
			}

			var transitionExist = false;
			for(var n = 0; n < state.transitions.length; n++){
				if(state.transitions[n].letter == currentLetter
					&& ((state.transitions[n].currentTop == this.stack[0] && state.transitions[n].currentTop)|| !state.transitions[n].currentTop)
					){
					console.log('\tcurrentTop = '+state.transitions[n].currentTop);
					if(state.transitions[n].currentTop == this.stack[0]){
						this.stack.shift();
					}

					if(state.transitions[n].newTop){
						var newTopTemp = state.transitions[n].newTop;
						for(var i = 0; i < newTopTemp.length; i++){
							this.stack.unshift(newTopTemp[i]);
						}
					}

					console.log(this.stack);
					this.print('\tstack: '+this.stack+"\n");

					console.log('\t('+state.name+','+currentLetter+')->'+state.transitions[n].state.name+"\n");
					this.print('\t('+state.name+','+currentLetter+')->'+state.transitions[n].state.name+"\n");
					this[state.transitions[n].state.name](newsubs);

					break;
				}
				if(state.transitions[n].letter == null && this.stack[0] == 'Z'){
					this.stack.shift();
				}
				// else{
				// 	console.log('\y>>>'+subs);
				// 	console.log('\y>>>'+this.stack);
				// }
				// else{
				// 	return this.Fail("Stack not empty");
				// 	return false;
				// }
			}
			if((subs.length <= 1 && subs[subs.length-1] == ' ' && this.stack.length > 0)){
				return this.Fail("Stack not empty");
				return false;
			}
		}
	});
};

stackDFA.prototype.Fail = function (n) {
	console.log(" Fail ");
	this.print("\n<b style='color:#e55;'> Fail! "+n+"</b>");
	return " Fail ";
};

stackDFA.prototype.Success = function (n) {
	console.log(" Success! ");
	this.print("\n<b style='color:#5e5;'> Success! "+n+"</b>");
	return "Success!";
};

stackDFA.prototype.print = function(text){
	var cur = $(this.output).html();
	// if(cur.length > 1 && text.length > 1){
		// cur = cur.replace(" ", "\t");
		// text = text.replace(" ", "\t");
	// }
	$(this.output).html(cur+text);
};

stackDFA.prototype.showTable = function(placeid){
	placeid = "#"+placeid;

	var tableTag = $("<table>");
	var trTag = $("<tr>");
	var thTag = $("<th>");
	var tdTag = $("<td>");

	trTag.append($("<th>"));
	trTag.append($("<th>").append('&delta;'));

	for (var i = 0; i < this.alphabet.length; i++) {
		trTag.append($("<th>").append(this.alphabet[i]));
	}

	tableTag.append(trTag);

	for(var m = 0; m < this.machineStates.length; m++){
		var trTag2 = $('<tr>');
		var s = this.machineStates[m];
		
		if(s.isInitial && s.isFinal){
			trTag2.append($("<td>").attr('class','isInitial isFinal').append(""));
		}
		else if(s.isInitial){
			trTag2.append($("<td>").attr('class','isInitial').append(""));
		}
		else if(s.isFinal){
			trTag2.append($("<td>").attr('class','isFinal').append(""));
		}
		else{
			trTag2.append($("<td>").append(""));
		}

		var thTag2 = $("<th>");
		thTag2.attr('class','firstState');
		thTag2.append(s.name);

		trTag2.append(thTag2);

		for (var i = 0; i < this.alphabet.length-1; i++){
			var strans;
			if(s.transitions[i]){
				strans = s.transitions[i].state.name;
			}
			else{
				strans = '-';
			}
			trTag2.append($("<td>").append(strans));
		}

		tableTag.append(trTag2);
	}

	var alpha = "&Sigma; = {";
	for (var i = 0; i < this.alphabet.length; i++) {
		if(this.alphabet.length-1 == i){
			alpha+=this.alphabet[i]+"}";
		}
		else{
			alpha+=this.alphabet[i]+", ";
		}
	}
	
	tableTag.attr('align', 'center');
	$(placeid).append(tableTag);
	$(placeid).append("<br>");
	$(placeid).append(alpha);
};

isInAlphabet = function(letter, alphabet){
	for (var i = 0; i < alphabet.length; i++)
		if(letter == alphabet[i]) return true;
	return false;
}

STATE = function(name,initial,final){
	this.name = name,
	this.isInitial = initial,
	this.isFinal = final,
	this.transitions = [];
}

// TRANSITION = function(letter, output,state){
TRANSITION = function(letter, currentTop, newTop, state){
	this.letter = letter;
	this.currentTop = currentTop;
	this.newTop = newTop;

	if(state.constructor.name == "STATE"){
		this.state = state;
	}
	else{
		console.log('Error to add transition');
	}
}