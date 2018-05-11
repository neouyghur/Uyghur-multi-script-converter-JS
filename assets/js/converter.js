/*function izip(list, values) {
  if (list == null) return {};
  var result = {};
  for (var i = 0, l = list.length; i < l; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}*/

function izip(list, values) {
  	return  list.reduce((accumulator, value, index) => (accumulator[value] = values[index], accumulator), {});
}


// UAS to CTS
function UAA2CTA(text)
{
	var amap = izip(UAA, CTA) // alphabet map
	var pmap = izip(RP, LP)
	// console.log(amap)
	var change = 1 // For control EMZE, u'ئ'
	var output = ''
	var pause = " "
	var achar = ''

	// debugger
	pos = 0
	size = text.length
	while (pos < size)
	{
		// To control unexpected non-unicode characters
		check = achar
		achar = amap[text[pos]]
		if (achar == undefined){
			//achar = text[pos]
			achar = pmap[text[pos]]
			if (achar == undefined){
				achar = text[pos]
			}
		}
		if (achar == "'")
		{
			if (change == 1 || (((allspecial.indexOf(amap[text[pos-1]]) != -1) || (amap[text[pos-1]] == undefined)) && allspecial.indexOf(amap[text[pos+1]]) !== -1)){
				achar = ""
			}
			change = 0
		}

		if (pause == achar){
				change = 1
		}
		else{
				change = 0
		}
		output += achar
		pos += 1 // go to next position
	}
	return output
}

function script2array(script) {
	switch(script) {
		case "UAA":
			return UAA
			break;
		case "ULA":
			return ULA
			break;
		case "APS":
			return APS
		case "UCA":
			return UCA
		case "CTA":
			return CTA
		case "custom":
			return custom
	}
}

function any2CTA(text, script) {	
	text = text.toLowerCase()

	if (script == "UAA"){
		output = UAA2CTA(text)
	}
	else {
		if (script == "ULA"){
			text = ULA2CTA_preprocess(text)
			text = text.replace(/n\'ğ/g, "nğ")
			text = text.replace(/s\'h/g, "sh")
			text = text.replace(/c\'h/g, "ch")
			text = text.replace(/z\'h/g, "zh")
			text = text.replace(/g\'h/g, "gh")
		}
		else if (script == "APS"){
			text = APS2CTA_preprocess(text)
		}
		var amap = izip(script2array(script), CTA)
		var output = '';  //text[pos]
		var pos = 0;
		var size = text.length;
		while (pos < size) {	
			var achar = amap[text[pos]]
			if (achar != undefined){
				output += achar
			}
			else{
				output += text[pos]
			}
			pos += 1
		}
	}
	return output
}

function CTA2any(text, script) {
	  
	text = text.toLowerCase();

	if (script == "UAA"){
		output = CTA2UAA(text)
	}
	else {
		//console.log(script)	
		//console.log(script2array(script))
		var amap = izip(CTA, script2array(script));
		var output = '';  //text[pos]
		var pos = 0;
		var size = text.length;
		// debugger
			while (pos < size) {
				var achar = amap[text[pos]]
				if (achar != undefined){
					if (script == 'ULA'){
						if (achar == 'n' && (amap[text[pos+1]] == 'g' || amap[text[pos+1]] == 'gh')){
							output += "n'"
						}
						else if (achar == preoutliers_no_n.indexOf(achar) && (amap[text[pos+1]] == 'h')){
							output += achar + "'"
						}
						else{
							output += achar			
						}
					}
					else{
						output += achar			
					}		
				}
				else{
					output += text[pos]
				}
				pos += 1
			}
		}
	return output
}

// Examples
// muellim maarip daire mueyyen tebiiy paaliyet is'haq
// مۇئەللىم مائارىپ دائىرە مۇئەييەن تەبىئىي پائالىيەت ئىسھاق

// UAS to CTS
function CTA2UAA(text)
{
	var amap = izip(CTA, UAA)
	var pmap = izip(LP, RP)
	var change = 1 // For control EMZE, u'ئ'
	var output = ''
	var pause = " "
	var achar = ''
	var previous = " "
	// var preoutliers = ['s', 'n', 'z', 'g', 'c']
	// var suboutliers = ['g', 'h']

	pos = 0
	size = text.length
	while (pos < size)
	{
		// To control unexpected non-unicode characters
		check = achar
		achar = amap[text[pos]]
		// debugger
		if (achar == undefined){
			achar = text[pos]
			//achar = text[pos]
			achar = pmap[text[pos]]
			if (achar == undefined){
				achar = text[pos]
			}
		}
		// else if ((allspecial.indexOf(text[pos]) != -1 && (allspecial.indexOf(previous) != -1 && vspecial.indexOf(text[pos-1]) != -1))
		//  && (pspecial.indexOf(text[pos+1]) == -1 || (pspecial.indexOf(text[pos+1]) != -1 && pspecial.indexOf(text[pos-1]) != -1)))
		// {
		// 	achar = 'ئ' + achar
		// }
		else if (allspecial.indexOf(text[pos]) != -1 && allspecial.indexOf(previous) != -1)
		//&& vspecial.indexOf(text[pos-1]) != -1)
		{
			debugger;
			if (vspecial.indexOf(text[pos+1]) != -1){
				achar = '' + achar
			}
			else if(allspecial.indexOf(previous) != -1){
				if (vspecial.indexOf(text[pos-1]) != -1 && allspecial.indexOf(text[pos+1]) != -1){

					achar = '' + achar
				}
				else{
					if (pos == text.length - 1) {
						achar = '' + achar
					}
					else{
					 	achar = 'ئ' + achar
					}
				}
			}
		}
		else if (preoutliers.indexOf(previous) != -1 && suboutliers.indexOf(text[pos+1]) != -1 && text[pos] == "'" )
		{
			achar = ""
		}
		previous = text[pos]
		output += achar
		pos += 1 // go to next position
	}
	//console.log(output)
	return output
}

 function ULA2CTA_preprocess(text)
 {
	 text = text.replace(/ch/g, "ç")
	 text = text.replace(/sh/g, "ş")
	 text = text.replace(/gh/g, "ğ")
	 text = text.replace(/zh/g, "j")
	 text = text.replace(/ng/g, "ñ")
	
	 return text
 }

 function APS2CTA_preprocess(text)
 {
	 text = text.replace(/c'/g, "ç")
	 text = text.replace(/s'/g, "ş")
	 text = text.replace(/g'/g, "ğ")
	 text = text.replace(/j'/g, "j")
	 text = text.replace(/o'/g, "ö")
	 text = text.replace(/u'/g, "ü")
	 text = text.replace(/a'/g, "e")
	 text = text.replace(/i'/g, "é")
	 text = text.replace(/n'/g, "ñ")

	 return text
 }
	
function convert() {

	var source_text = document.getElementById("source").value
	//console.log(source_text)
	var CTA_text = ""

	// console.log(source_script)
	// console.log(target_script)
	if (source_script == target_script){
		document.getElementById("target").value = source_text
	}
	else{
		CTA_text = any2CTA(source_text, source_script)
		// console.log(CTA_text)
		document.getElementById("target").value = CTA2any(CTA_text, target_script)
	}
}

function blank() {
	document.getElementById("source").value = ""
	document.getElementById("target").value = ""
}

function get_source_script() {
	// alert(this.options[this.selectedIndex].text);
	document.getElementById("source").setAttribute("class", "");
	source_script = document.querySelector('input[name = src_script]:checked').value;

	if(document.querySelector('input[name = stext]:checked').value == 'nt') {
		blank()
		return
	}
	

	if (source_script == 'UAA'){
		document.getElementById("source").value = sample_UAA_text;
		document.getElementById("source").setAttribute("class", "th-uas");
	}
	else if (source_script == 'UCA'){
		document.getElementById("source").value = sample_UCA_text;
	}
	else if (source_script == 'ULA'){
		document.getElementById("source").value = sample_ULA_text;
	}
	else if (source_script == 'APS'){
		document.getElementById("source").value = sample_APS_text;
	}
	else if (source_script == 'CTA'){
		document.getElementById("source").value = sample_CTA_text;
	}
	else if (source_script == 'custom'){
	 	blank()
	}
	else{
		blank()
	}
}

function get_target_script() {
	document.getElementById("target").value = ""
	target_script = document.querySelector('input[name = trg_script]:checked').value;
	document.getElementById("target").setAttribute("class", "");
	// alert(this.options[this.selectedIndex].text);
	//alert(target_script);
	if (target_script == 'UAA'){
		document.getElementById("target").setAttribute("class", "th-uas");
	}
}

function solution(event) {
  //alert(this.options[this.selectedIndex].value);
  // var sol = this.options[this.selectedIndex].value;

  var sol = document.querySelector('input[name = plan]:checked').value;
	
	if (sol=='ULA'){
		assign(ULA);
	}
	else if (sol=='CTA') {
		assign(CTA);
	}
	else if (sol=='APS')  {
		assign(APS);
	}
	else {
		console.log("wrong selection")
	}
}

function get_custom() {
	custom = []
	for (i = 0; i < IDs.length; i++) {
	 	custom.push(document.getElementById(IDs[i]).value)
	}
	custom.push("'")
	custom.push('ya')
	custom.push('yu')
}

function assign(arr) {
	for (i = 0; i < IDs.length; i++) { 
		//console.log(IDs[i]);
		document.getElementById(IDs[i]).value = arr[i];
	}
}

function info(arr){
	var ug_str ="ئۆزىڭىزنىڭ لايىھىسىنى سىنىماقچى بولسىڭىز، تۆۋەندىكى تىرناقلارنى ئۆزىڭىز تولدۇرۇڭ."
	var crl_str = "өзиңизниң лайиһисини синимақчи болсиңиз, төвәндики тирнақларни өзиңиз толдуруң."
	if (noinfo==0) {
		alert(ug_str + "\n" + crl_str)
		noinfo = 1
	}
}

// Right punctuations
var RP = ['،', '؟', '؛', '٭', '“', '„', '&#8220;', '&#8222;', '”', '‟', '&#8221;', '&#8223;']

// Left punctuations
var LP = [',', '?', ';', '*', '„', '«', '«','»',  '»', '»', '»', '»']

var preoutliers_no_n = ['s', 'z', 'g', 'c']
var preoutliers = ['s', 'n', 'z', 'g', 'c']
var suboutliers = ['ğ', 'g', 'h']
var vspecial = ['o', 'u', 'ö', 'ü'] // ver extreme case
var cspecial = ['a', 'i', 'o', 'u', 'ö', 'ü', 'é', 'e'] // char special
var pspecial = [" ", "(", ",", "{", "}", ",", ".", "!", '"', '-'] // punctuation special
var allspecial = cspecial + pspecial + ['\n', '\r', '\t']

var UAA = ['ا', 'ە', 'ب', 'پ', 'ت', 'ج', 'چ', 'خ', 'د', 'ر', 'ز', 'ژ', 'س', 'ش', 'ف', 'ڭ', 'ل',
'م', 'ھ', 'و', 'ۇ', 'ۆ', 'ۈ', 'ۋ', 'ې', 'ى', 'ي', 'ق', 'ك', 'گ', 'ن', 'غ', 'ئ', 'يا', 'يۇ'];

// Commont Turkick alphabet
var CTA = ['a', 'e', 'b', 'p', 't', 'c', 'ç', 'x', 'd', 'r', 'z', 'j', 's', 'ş', 'f', 'ñ', 'l',
'm', 'h', 'o', 'u', 'ö', 'ü', 'v', 'é', 'i', 'y', 'q', 'k', 'g', 'n', 'ğ', "'",  'ya', 'yu'];

// Uyghur Latin alphabet
var ULA = ['a', 'e', 'b', 'p', 't', 'j', 'ch', 'x', 'd', 'r', 'z', 'zh', 's', 'sh', 'f', 'ng', 'l',
'm', 'h', 'o', 'u', 'ö', 'ü', 'w', 'é', 'i', 'y', 'q', 'k', 'g', 'n', 'gh', "'", 'ya', 'yu'];

// Uyghur Cyrillic alphabet
var UCA = ['а', 'ә', 'б', 'п', 'т', 'җ', 'ч', 'х', 'д', 'р', 'з', 'ж', 'с', 'ш', 'ф', 'ң', 'л',
'м', 'һ', 'о', 'у', 'ө', 'ү', 'в', 'е', 'и', 'й', 'қ', 'к', 'г', 'н', 'ғ', "'", 'я', 'ю'];

// Qazaq apstrov alphabet
// var APS = ['a', "a'", 'b', 'p', 't', 'j', "c'", 'x', 'd', 'r', 'z', "j'", 's', "s'", 'f', "n'", 'l',
// 'm', 'h', 'o', 'u', "o'", "u'", 'w', "i'", 'i', 'y', 'q', 'k', 'g', 'n', "g'", "'", 'ya', 'yu'];

// Qazaq apstrov alphabet
var APS = ['a', "a'", 'b', 'p', 't', 'jh', "ch", 'x', 'd', 'r', 'z', "j", 's', "sh", 'f', "ng", 'l',
'm', 'h', 'o', 'u', "o'", "u'", 'v', "e", 'i', 'y', 'q', 'k', 'g', 'n', "gh", "'", 'ya', 'yu'];

// // Ozebk alphabet
// var OBK = ['a', "a'", 'b', 'p', 't', 'j', "c'", 'x', 'd', 'r', 'z', "j'", 's', "sh", 'f', "nh", 'l',
// 'm', 'h', 'o', 'u', "o'", "u'", 'w', "i'", 'i', 'y', 'q', 'k', 'g', 'n', "gh", "'", 'ya', 'yu'];

// Custom script
var custom = []

// Ids of inputs
var IDs = ['A', "a", 'B', 'P', 'T', 'J', "c", 'X', 'D', 'R', 'Z', "j", 'S', "s", 'F', "n", 'L',
'M', 'H', 'O', 'U', "o", "u", 'W', "i", 'I', 'Y', 'Q', 'K', 'G', 'N', "g"];

var noinfo = 0;
var with_sample_text = 1;

var source_script = "";
var target_script = "";

sample_UAA_text = "ھەممە ئادەم تۇغۇلۇشىدىنلا ئەركىن، ئىززەت۔ھۆرمەت ۋە ھوقۇقتا باب۔باراۋەر بولۇپ تۇغۇلغان. ئۇلار ئەقىلگە ۋە ۋىجدانغا ئىگە ھەمدە بىر۔بىرىگە قېرىنداشلىق مۇناسىۋىتىگە خاس روھ بىلەن مۇئامىلە قىلىشى كېرەك.\n\n";
sample_UAA_text += "قول باش پۇت كۆز جەڭچى جۇدې سان سەي ئې شىر شاڭخەي كىتاب ۋەتەن تومۇر كۆمۈر ئېلىكتىر ۋەتەن ۋيېتنام شىنجاڭ ئانار ئەنجۈر ئوردا ئۇرۇش ئۆردەك ئۈزۈم ئېلان ئىنكاس ئىنىكئانا ئەسئەت رادىئو مەسئۇل قارىئۆرۈك نائۈمىد ئىتئېيىق جەمئىي نەمەنگان ئۆزخان پاسخا بايرىمى جۇڭخۇا";

sample_CTA_text = "hemme adem tuğuluşidinla erkin, izzet-hörmet ve hoquqta babbaraver bolup tuğulğan. ular eqilge ve vicdan'ğa ige hemde bir-birige qérindaşliq munasivitige xas roh bilen mu'amile qilişi kérek."
sample_UCA_text = "Һәммә адәм туғулушидинла әркин, иззәт-һөрмәт вә һоқуқта баббаравәр болуп туғулған. Улар әқилгә вә виҗданға игә һәмдә бир-биригә қериндашлиқ мунасивитигә хас роһ билән муамилә қилиши керәк.";
sample_ULA_text = "Hemme adem tughulushidinla erkin, izzet-hörmet we hoquqta babbarawer bolup tughulghan. Ular eqilge we wijdan'gha ige hemde bir-birige qérindashliq munasiwitige xas roh bilen mu'amile qilishi kérek.";
sample_APS_text = "ha'mma' ada'm tughulushidinla a'rkin, izza't۔ho'rma't va' hoquqta bab۔barava'r bolup tughulghan. ular a'qilga' va' vijhdangha iga' ha'mda' bir۔biriga' qerindashliq munasivitiga' xas roh bila'n muamila' qilishi kera'k."
+ "qol bash put ko'z jha'ngchi jhude san sa'y e shir shangxa'y kitab va'ta'n tomur ko'mu'r eliktir va'ta'n vyetnam shinjhang anar a'njhu'r orda urush o'rda'k u'zu'm elan inkas inik'ana a's'a't radio ma's'ul qario'ru'k nau'mid it'eyiq"
+ "jha'm'iy na'ma'ngan o'zxan pasxa bayrimi jhungxua"

//TODO: change the regular expression.
