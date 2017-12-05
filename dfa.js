var DFA = new Object();

DFA = function(){
	this.input = "";
	this.output = "";
};

DFA.prototype.run = function(input){
	console.log("Running \""+input+"\"");
	this.q0(input);
};

DFA.prototype.machineStates = [];
DFA.prototype.alphabet = [];

DFA.prototype.addState = function(state){
	this.machineStates.push(state);
	for(var i = 0; i < state.transitions.length; i++){
		if(!isInAlphabet(state.transitions[i].letter, this.alphabet)){
			this.alphabet.push(state.transitions[i].letter);
		}
	}
	Object.defineProperty(this,state.name,{
		value: function(subs){
			if(subs.length < 1 && state.isFinal){
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
			this.print("\tCurrent state: "+state.name+";");

			element = subs[0];
			newsubs = subs.substring(1,subs.length);

			if(!isInAlphabet(element,this.alphabet)){
				return this.Fail();
			}

			var transitionExist = false;
			for(var n = 0; n < state.transitions.length; n++){
				if(state.transitions[n].letter == element){
					console.log('\t('+state.name+','+element+')->'+state.transitions[n].state.name+"\n");
					this.print('\t('+state.name+','+element+')->'+state.transitions[n].state.name+"\n");
					this[state.transitions[n].state.name](newsubs);
					break;
				}
			}

		}
	});
};

DFA.prototype.Fail = function (n) {
	console.log(" Fail ");
	this.print("\n<b style='color:#e55;'> Fail! "+n+"</b>");
	return " Fail ";
};

DFA.prototype.Success = function (n) {
	console.log(" Success! ");
	this.print("\n<b style='color:#5e5;'> Success! "+n+"</b>");
	return "Success!";
};

DFA.prototype.print = function(text){
	var cur = $(this.output).html();
	// if(cur.length > 1 && text.length > 1){
		// cur = cur.replace(" ", "\t");
		// text = text.replace(" ", "\t");
	// }
	$(this.output).html(cur+text);
};

DFA.prototype.showTable = function(placeid){
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


	// var trTag2 = $('<tr>');
	for(var m = 0; m < this.machineStates.length; m++){
		var trTag2 = $('<tr>');
		var s = this.machineStates[m];
		
		if(s.isInitial && s.isFinal){
			trTag2.append($("<td>").attr('class','isInitial isFinal').append(""));
		}
		else if(s.isInitial){
			trTag2.append($("<td>").attr('class','isFinal').append(""));
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

		for (var i = 0; i < s.transitions.length; i++){
			var strans = s.transitions[i].state.name;
			trTag2.append($("<td>").append(strans));
		}
		tableTag.append(trTag2);
	}
	// tableTag.append(trTag2);

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

TRANSITION = function(letter, state){
	this.letter = letter;
	if(state.constructor.name == "STATE"){
		this.state = state;
	}
	else{
		console.log('Error to add transition');
	}
}