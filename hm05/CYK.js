var Grammar = new Object();

Grammar = function(){
	this.nonterminals = [];
	this.CYKmatrix = [];
};

Grammar.prototype.runCYK = function(inputstring){
	var wsize = inputstring.length;
	if(wsize == undefined || wsize <= 0){
		alert("Input must be greater than zero!");
		return false;
	}

	// Inicializando primeira linha da matriz do CYK
	// Primeira linha equivale a palavra a ser analisada
	var temparray = [];
	for(var i = 0; i < wsize; i++){
		temparray.push(inputstring[i]);
	}

	for(var i=1; i<(wsize+1); i++) {
		this.CYKmatrix[i-1] = new Array(i);
	}
	this.CYKmatrix[wsize] = temparray;

	// Setting first CYKmatrix line
	// This loop checks only the line of index 0 of the CYKmatrix
	// Completando a segunda linha da matriz, a qual é a primeira localização de termos da gramática
	// Simplesmente verifica quais não-terminais geram uma letra da palavra em suas possíveis produções
	for(var i=0; i<(this.CYKmatrix[wsize-1].length); i++){
		var temp = this.findProduction(this.CYKmatrix[wsize][i]);
		if(temp){
			this.CYKmatrix[wsize-1][i] = temp;
		}
	}
	// Setting second CYKmatrix line
	// for(var i=0; i<(this.CYKmatrix[wsize-2].length); i++){
	// 	var temp = this.findProduction(this.CYKmatrix[wsize-1][i]+this.CYKmatrix[wsize-1][i+1]);
	// 	// console.log(temp)
	// 	if(temp){
	// 		this.CYKmatrix[wsize-2][i] = temp;
	// 	}
	// }

	// console.log(this.CYKmatrix);
	// Setting values for the rest fo the CYKmatrix
	// Laços que percorrem a matriz completando-a com as combinações dos valores calculados anteriormente
	var str = "";
	for(var i = wsize-2; i >= 0; i--){
		for(var j = 0; j < this.CYKmatrix[i].length; j++){
			// console.log(i+","+j);
			str+="("+i+","+j+") = ";
			var concatArray = [];

			// console.log(i+','+j);

			for(var k = 0; k < wsize-(i+1); k++){
				// Percorrendo a matriz conforme a roldana do algoritmo CYK
				var vx = wsize-k-1;
				var vy = j;
				var dx = i+k+1;
				var dy = vy+1+k;

				// console.log("("+vx+","+vy+") = "+this.CYKmatrix[vx][vy]+" ("+dx+","+dy+") = "+this.CYKmatrix[dx][dy]);
				this.combineArray(this.CYKmatrix[vx][vy],this.CYKmatrix[dx][dy], i, j);
				
				str+="("+vx+","+vy+")("+dx+","+dy+")\t";
			}
			// if(i < 2){
			// 	break;
			// }
			str+="\n";
		}
		str+="\n";
	}
	// console.log(str);
	// console.log(this.CYKmatrix[0][0]);
	var s = "";
	for(var i = 0; i < this.CYKmatrix.length; i++){
		s+=(i+1)+") ";
		for(var j = 0; j < this.CYKmatrix[i].length; j++){
			if(this.CYKmatrix[i][j] != undefined){
				s += "["+this.CYKmatrix[i][j]+"]";
				for(var k = 0; k < 3-this.CYKmatrix[i][j].length; k++){
					s+="\t";
					// s+="\t";
				}
			}
			else{
				s+="[-]";
			}
		}
		s+="\n";
	}
	console.log(this.CYKmatrix);
	console.log(s);


	// Procurando S na primeira posição da matriz
	// Caso S seja encontrado, então a palavra é reconhecida
	// Do contrário a palavra é recusada
	if(this.CYKmatrix[0][0] != undefined){
		for(var i=0; i<(this.CYKmatrix[0][0].length); i++){
			if(this.CYKmatrix[0][0][i] == this.nonterminals[0].head){
				return true;
				break;
			}
		}
	}
	return false;

};

// Combina os valores de cada posição da matriz CYK
Grammar.prototype.combineArray = function(arrA, arrB, posi, posj){
	if(arrA != undefined){
		
		for(var i = 0; i < arrA.length; i++){
			if(arrB != undefined){
				
				for(var j = 0; j < arrB.length; j++){
					var temp = this.findProduction(arrA[i]+arrB[j])
					// console.log(arrA[i]+arrB[j]);
					if(temp != undefined && temp.length > 0){
						if(this.CYKmatrix[posi][posj] == undefined){
							this.CYKmatrix[posi][posj] = temp;
						}
						else{
							for(var n = 0; n < temp.length; n++){
								if(this.CYKmatrix[posi][posj].indexOf(temp[n]) < 0){
									this.CYKmatrix[posi][posj].push(temp[n]);
								}
							}
						}
						// console.log("\t("+posi+","+posj+"): "+arrA[i]+arrB[j]+" = "+temp);
					}
					// console.log(temp);
				}
			}
		}
		// console.log("("+posi+","+posj+") = "+temp);
	}
}

// Procura valores nas produções de cada não terminal
Grammar.prototype.findProduction = function(input){
	// var str = 'looking for '+ input;
	var result = [];
	for(var i = 0; i < this.nonterminals.length; i++){
		for(var j = 0; j < this.nonterminals[i].prod.length; j++){
			if(input == this.nonterminals[i].prod[j]){
				// str += ": found in "+this.nonterminals[i].head;
				result.push(this.nonterminals[i].head);
			}
		}
	}
	// console.log(str);
	return result;
}

// Manipula o texto de entrada para reconhecer uma gramática
Grammar.prototype.setGrammar = function(input){
	input = input.replaceAll(" ","");
	input = input.replaceAll("	","");
	input = input.replaceAll("\t","");
	input = input.replaceAll("\n",";");
	input += ";";

	var productions = "";
	var localNonTerminal = "";
	while (input.length > 0){
		localNonTerminal = input[0];
		if(input[0] == ";" && input[1] == ";"){
			break;
		}

		input = input.substring(input.indexOf("-") + 1);
		input = input.substring(input.indexOf(">") + 1);

		productions = input.substring(0, input.indexOf(";"));

		this.nonterminals.push({
			head:localNonTerminal,
			prod:productions.split("|")
		});

		input = input.substring(input.indexOf(";") + 1);
	}
	// console.log(this.nonterminals);

	return false;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};