var editMode = false;
var contenedoresTexto = ['DIV','SPAN','FONT','LABEL','P','STRONG','LI','A','H1','H2','H3','H4','H5','H6','TABLE','TBODY','TR','TD'];

var timerModal = null;

var elementsArray = [];//array para los path de los elementos, se utilizará como un ID 

	
var arrayText = [];
var nTexts = 0;

var multiTextArray =[]; //array para los valores de de los elementos

var textGroupArray = []; //array para los valores de de los grupos

var indexText = 0;

var actualSelector = null;


function makeSelector(el) {
		var tag, index, stack = [];

	for (; el.parentNode; el = el.parentNode) {
	    tag = el.tagName;
	    for (index = 0; el.previousSibling;) {
	      el = el.previousSibling;
	      if (tag == el.tagName)
	        index += 1;
	    }
	 
	    stack.unshift(tag + ':eq(' + index + ')');
	}

		return stack.join(' > ');
}




var TextGroup = function(name) {
    this.name = name;
  
    	    
};



function setTextInArray(input){

	var elementIndex = $(input).attr('index');
	var elementValue = input.value;
	arrayText[elementIndex] = elementValue;
	
}
	



function focusElement(input,path){
	console.debug($(path));
	

}

function descomponerNodoPadre(nodo){
	var hijos = $(nodo).children();
	$.each(hijos, function(i, hijo) {
		if($(hijo).children().length==0  && contenedoresTexto.indexOf(hijo.nodeName)>-1){
			$(this).hover(function() {
				setHover(this);
			}, function() {
		  		clearInterval(timerModal);
		    	$( this ).removeClass( "hoverTag" );
			});
			
			
		}else if($(hijo).children().length>0 && contenedoresTexto.indexOf(hijo.nodeName)>-1){
			descomponerNodoPadre(hijo);
		}
		
				
	});
}


function toggleTexts(){

	if(indexText<textGroupArray.length-1){
		indexText++;
	}else{
		indexText=0;
	}
	
		
	
	$.each(elementsArray, function(i, element) {
		var text = multiTextArray[i][indexText];
		$(element).html(text);
		
		
	});
	

}


function searchLanguaje(name){
	
	if(textGroupArray.length==0){
		
		return -1;
		
	}else{
		var index = -1;
		$.each(textGroupArray, function(i, element) {
			if(element.name==name)
				index = i;
			
		});
		
		return index;
		
	}
}

function selectLanguage(index){
	
	if(isNaN(index)){
		
		var i = searchLanguaje(index);
		
		if(i>-1)
			indexText = i;
		else
			return false;
		
		
		
	}else if(index-1 < elementsArray.length){
		console.debug('llegue aqui2');
		indexText = index-1;
		
		
	}else{
		console.debug('llegue aqui3');
		return false;
		
	}
	console.debug('llegue aqui4');
	$.each(elementsArray, function(i, element) {
		var text = multiTextArray[i][indexText];
		$(element).html(text);
		
	});
	
}




function getSourceTextGroup(){
	var code = "";
	code = code.concat("$(window).load(function() {\n\n");
	code = code.concat("\t/*****************************************/\n");
	code = code.concat("\t/*****Generación de Grupos de Textos******/\n");
	$.each(textGroupArray, function(i, group) {
	
		code = code.concat("\t textGroupArray[textGroupArray.length] = new TextGroup('" + group.name + "');\n");			
		
	});
	code = code.concat("\n\n");
	code = code.concat("});\n\n");
	
	return code;
}

function getSourceTexts(){
	var code = "";
	code = code.concat("$(window).load(function() {\n\n");
	code = code.concat("\t/*****************************************/\n");
	code = code.concat("\t/*********Generación de Textos************/\n");
	
	
	$.each(elementsArray, function(i, element) {
		
		code = code.concat("\t elementsArray[" + i +"] = '" + element + "';\n");	
	
		
		
	});
	
	$.each(elementsArray, function(i, element) {
		var strArray = "";
		$.each(multiTextArray[i], function(j, text) {
			if(j==0)
				strArray = strArray.concat("'" + text + "'");
			else
				strArray = strArray.concat(",'" + text + "'");
			//console.debug(textArray.length);	
		
		});
		code = code.concat("\t multiTextArray[" + i +"] = [" + strArray + "];\n");	
		
		
	});
	
	code = code.concat("\n\n");
	code = code.concat("});\n\n");
	
	
	return code;
}



	
function openExportCode(){

	var code ="< script type='text/javascript'>\n" + getSourceTextGroup() + getSourceTexts() + "< /script>\n";
	code = code.replace('< s', '<s');
	code = code.replace('< /', '</');
	var html = $('#contaninerCode').html().replace('tCode','txtCode');
		
		
	new PopupJS(html, {title: 'Exportar Código Fuente', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Aceptar', val: 'Y'}],callback: function(val) { 
		
		
		if(val=='Y'){
			
		
		}
				
	}});
	$('textarea#txtCode').text(code);
}


function setHover(elementHover){
	var selector = makeSelector(elementHover);
	actualSelector = selector;
				
    $(elementHover).addClass( "hoverTag" );
    
   	timerModal = setTimeout(function(){
   	
   			for(var j=0;j<nTexts;j++){
   				arrayText[j]="";
   			}
   			
   			var indexInArrayElementSelected = elementsArray.indexOf(actualSelector);
   			var inputs = $('input.inputText');
   			if(indexInArrayElementSelected>-1){
				$.each(inputs, function(i, input) {
					var value = multiTextArray[indexInArrayElementSelected][i];
					$(input).attr('value',value);
				});
				
			}else{
			
				$.each(inputs, function(i, input) {
					$(input).attr('value','');
				
				});
			}
   		
   	 		var htmlMultiText = $('#wrapperText').html();
   	 		htmlMultiText = htmlMultiText.replace('id="tPath" value="valor"' ,'id="txtPath" value="' + selector + '" ');
   	 		htmlMultiText = htmlMultiText.replace('tableEditText','tableTexts');
			new PopupJS(htmlMultiText, {title: 'Configurar Múltiple Texto', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Aceptar', val: 'Y'},{id: 1, label: 'Cancelar', val: 'N'}],callback: function(val) { 
				
				if(val=='Y'){
					var newIndex = elementsArray.length;
					
					if(elementsArray.indexOf(actualSelector)>-1){
						newIndex = elementsArray.indexOf(actualSelector);
					}
					console.debug('-----------------------------------------');
					elementsArray[newIndex] = actualSelector;
					var arrayAux = [];
					
					for(var j=0;j<arrayText.length;j++){
						arrayAux[j] = arrayText[j];
					}
					multiTextArray[newIndex] = arrayAux;
					
					$.each(elementsArray, function(i, value) {
						console.debug('Elemento ' + i + ':' + value);
					
						$.each(multiTextArray[i], function(key,val) {
						
								console.debug('		text ' + key + ':' + val);
						
						});
						console.debug('-----------------------------------------');
					});
				
				}
				
			}});
   	}, 800);
  	
}

function downText(element,index){
	
	if($(element).prop('class')=='disableDown')
		return false;
		
	var elementToDown = textGroupArray[index];
	var elementAux = textGroupArray[index+1];

	textGroupArray[index] = elementAux;
	textGroupArray[index+1] = elementToDown;
	
	console.debug(index);
	
	$('#tableOptions > tbody').html(makeHtmlRowsText());
	

}

function upText(element,index){
	
	if($(element).prop('class')=='disableUp')
		return false;
		
	var elementToUp = textGroupArray[index];
	var elementAux = textGroupArray[index-1];

	textGroupArray[index] = elementAux;
	textGroupArray[index-1] = elementToUp;
	
	console.debug(index);
	
	$('#tableOptions > tbody').html(makeHtmlRowsText());
	

}

function makeRowsTextGroups(){

	var htmlRows = "";
	
	$.each(textGroupArray, function(index, group) {
		var trOpen =  "<tr class='trField'>";
		var tdTitle = "<td class='tdTitle'>" + group.name +'</td>';
		var tdField = "<td class='tdField'><input class='inputText' type='text' index='"+ index +"' onchange='setTextInArray(this)'/></td>";
		var trClose =  "</tr>";
	
		htmlRows = htmlRows.concat(trOpen);
		htmlRows = htmlRows.concat(tdTitle);
		htmlRows = htmlRows.concat(tdField);
		htmlRows = htmlRows.concat(trClose);
		
		
		
		arrayText[index]="";
	
	});
	$( "#tableEditText" ).html("<tbody>" + htmlRows +  "</tbody>");
}

function addText(element){

	var input = $($($($(element).parent()).parent()).children()[0]).children()[0];
	if(input.value!=null && input.value.trim().length>0){
		textGroupArray[textGroupArray.length] = new TextGroup(input.value);
		$('#tableOptions > tbody').html(makeHtmlRowsText());
	}
	nTexts = textGroupArray.length;
	
	makeRowsTextGroups();
	
var htmlRows = "";
	
	$.each(textGroupArray, function(index, group) {
	
				
		
		var trOpen =  "<tr class='trField'>";
		var tdTitle = "		<td class='tdTitle'>" + group.name +'</td>';
		var tdField = "		<td class='tdField'><input class='inputText' type='text' index='"+ index +"' onchange='setTextInArray(this)'/></td>";
		var trClose =  "</tr>";
		

		htmlRows = htmlRows.concat(trOpen);
		htmlRows = htmlRows.concat(tdTitle);
		htmlRows = htmlRows.concat(tdField);
		htmlRows = htmlRows.concat(trClose);
		
		
		
		arrayText[index]="";
	
	});
	var trPath = "";
		
	trPath = trPath.concat("<tr class='classIdPath'>");
	trPath = trPath.concat("	<td colspan='2'><input id='tPath' value='valor' type='text'  readonly='readonly' onmouseover=\"$(this).addClass( 'pathFocus');$(this.value).addClass( 'pathFocus');\" onmouseout=\"$(this).removeClass( 'pathFocus');$(this.value).removeClass( 'pathFocus')\"/></td>");
	trPath = trPath.concat("</tr>");
	
	$( "#tableEditText" ).html("<tbody>" + trPath + htmlRows +  "</tbody>");
	
	$('.classIdPath > td:eq(0) > input').hover(function() {
		$(this).addClass( "pathFocus" );
	}, function() {
    	$(this ).removeClass( "pathFocus" );
	});

}

function editText(element,index){

	var input = $($($($(element).parent()).parent()).children()[0]).children()[0];
	
	if($(input).prop('disabled')==false){
		$(input).prop('disabled',true);
		$(input).addClass("noEditable");
		
		$(element).removeClass("btnSave");
		$(element).addClass("btnEdit");
		
		if(input.value!=null && input.value.trim().length>0){
			textGroupArray[index] = new TextGroup(input.value);
			
		}
		$('#tableOptions > tbody').html(makeHtmlRowsText());
		
	}else{
		$(input).prop('disabled',false);
		$(input).removeClass("noEditable");
		
		$(element).removeClass("btnEdit");
		$(element).addClass("btnSave");
		
		$(input).focus();
	}
	
	nTexts = textGroupArray.length;
	makeRowsTextGroups();
	
	
	
	

}

function deleteText(index){
	if(index>0)
		textGroupArray.splice(index, index);
	else
		textGroupArray.splice(0, 1);
	
	$('#tableOptions > tbody').html(makeHtmlRowsText());
	
	nTexts = textGroupArray.length;
	makeRowsTextGroups();

}

function makeHtmlRowsText(){
	var html = "";
	$.each(textGroupArray, function(key,val) {
		
		var classUp=' class="btnUp noEditable" ';	
		var classDown=' class="btnDown noEditable" ';	
		if(key == 0)
			 classUp=' class="disableUp" ';
		if(key+1 == textGroupArray.length)
			 classDown=' class="disableDown" ';	 		
		html=html.concat('	<tr>');
		html=html.concat('		<td><input class="noEditable" disabled="disabled" type="text" value="' + val.name  +'"/></td>');
		html=html.concat('		<td>');
		html=html.concat("			<div noedit='true'" + classDown + " onclick = 'downText(this," + key + ")'></div>");
		html=html.concat("			<div noedit='true'" + classUp  + " onclick = 'upText(this," + key + ")'></div>");
		html=html.concat("			<div noedit='true' class='btnEdit' onclick = 'editText(this," + key + ")'></div>");
		html=html.concat("			<div noedit='true' class='btnDelete' onclick='deleteText(" + key + ")'></div>");
		html=html.concat('		</td>');
		html=html.concat('	</tr>');
		
		
		
	
		console.debug('		text ' + key + ':' + val);
		
						
	});
	html=html.concat('	<tr>');
	html=html.concat('		<td><input type="text" value=""/></td>');
	html=html.concat('		<td>');
	html=html.concat("			<div noedit='true' class='btnAdd' onclick='addText(this)'></div>");
	html=html.concat('		</td>');
	html=html.concat('	</tr>');
	
	return html;
}

function openPopupCustomizeText(){
	//console.debug(textGroupArray.length);
	
	
	$('#tableOptions > tbody').html(makeHtmlRowsText());
	new PopupJS($('#divOptions').html(), {title: 'Configurar Textos', titleClass: 'anim error', modal:true, buttons: [{id: 0, label: 'Aceptar', val: 'Y'}],callback: function(val) { 
				
		if(val=='Y'){
			
		
		}
				
	}});
}


function initMultiLanguage(){
	
	if(!editMode){
		$('.btnSettings').css('display','none');
		return false;
	}
	
	//$('body').append("<input type='button' onclick='toggleTexts()' value='toggle'/>");
	
	var wrapperText = "";
	wrapperText = wrapperText.concat("<div id='wrapperText'>");
	wrapperText = wrapperText.concat("	<table id='tableEditText'></table>");
	wrapperText = wrapperText.concat("</div>");
	
	var btnSettings = "<div class='btnSettings' noedit='true' onclick='openPopupCustomizeText()'></div>";
	var btnExportCode = "<div class='btnExportCode' noedit='true' onclick='openExportCode()'></div>";
	
	var contaninerCode = "";
	contaninerCode = contaninerCode.concat("<div id='contaninerCode'>");
	contaninerCode = contaninerCode.concat("	<div style='width:90%; margin-left: auto; margin-right: auto;'>");
	contaninerCode = contaninerCode.concat("		<h2 style='font-size: 14px; font-weight: 100; font-family: \"Trebuchet MS\", Helvetica, sans-serif'>Agregue el siguiente Código fuente al inicio de la etiqueta <strong>HEAD</strong> </h2>");
	contaninerCode = contaninerCode.concat("		<textarea id='tCode' class='txtCode' rows=\"20\" cols=\"1\" style=\"width: 100%\" ></textarea>");	
	contaninerCode = contaninerCode.concat("	</div>");
	contaninerCode = contaninerCode.concat("</div>");

	var divOptions = "";
	divOptions = divOptions.concat("<div id='divOptions' noedit='true'>");
	divOptions = divOptions.concat("	<table id='tableOptions' noedit='true'>");
	divOptions = divOptions.concat("		<tr>");
	divOptions = divOptions.concat("			<td><input type='text'/></td>");
	divOptions = divOptions.concat("			<td>");
	divOptions = divOptions.concat("				<div noedit='true' class='btnDown'></div>");
	divOptions = divOptions.concat("				<div noedit='true' class='btnUp'></div>");
	divOptions = divOptions.concat("				<div noedit='true' class='btnEdit'></div>");
	divOptions = divOptions.concat("				<div noedit='true' class='btnDelete'></div>");
	divOptions = divOptions.concat("			</td>");	
	divOptions = divOptions.concat("		</tr>");			
	divOptions = divOptions.concat("	</table>");	
	divOptions = divOptions.concat("</div>");				
	
	$('body').append(btnSettings);
	$('body').append(btnExportCode);
	$('body').append(wrapperText);
	$('body').append(contaninerCode);
	$('body').append(divOptions);
	
	
	$(".btnSettings").draggable();
	$(".btnExportCode").draggable();
	
	var htmlRows = "";
	
	$.each(textGroupArray, function(index, group) {
	
				
		
		var trOpen =  "<tr class='trField'>";
		var tdTitle = "		<td class='tdTitle'>" + group.name +'</td>';
		var tdField = "		<td class='tdField'><input class='inputText' type='text' index='"+ index +"' onchange='setTextInArray(this)'/></td>";
		var trClose =  "</tr>";
		

		htmlRows = htmlRows.concat(trOpen);
		htmlRows = htmlRows.concat(tdTitle);
		htmlRows = htmlRows.concat(tdField);
		htmlRows = htmlRows.concat(trClose);
		
		
		
		arrayText[index]="";
	
	});
	var trPath = "";
		
	trPath = trPath.concat("<tr class='classIdPath'>");
	trPath = trPath.concat("	<td colspan='2'><input id='tPath' value='valor' type='text'  readonly='readonly' onmouseover=\"$(this).addClass( 'pathFocus');$(this.value).addClass( 'pathFocus');\" onmouseout=\"$(this).removeClass( 'pathFocus');$(this.value).removeClass( 'pathFocus')\"/></td>");
	trPath = trPath.concat("</tr>");
	
	$( "#tableEditText" ).html("<tbody>" + trPath + htmlRows +  "</tbody>");
	
	$('.classIdPath > td:eq(0) > input').hover(function() {
		$(this).addClass( "pathFocus" );
	}, function() {
    	$(this ).removeClass( "pathFocus" );
	});

	var elementosPrincipales =  $('body').children();
	
	$.each(elementosPrincipales, function(index, nodoHijo) {
	
		if($(nodoHijo).attr('noedit')==null){
			if(contenedoresTexto.indexOf(nodoHijo.nodeName)>-1 && $(nodoHijo).children().length>0){
				descomponerNodoPadre(nodoHijo);
			}else if(contenedoresTexto.indexOf(nodoHijo.nodeName)>-1){
			
				$(nodoHijo).hover(function() {
					console.debug(nTexts);
					setHover(nodoHijo);
				}, function() {
			  		clearInterval(timerModal);
			    	$( nodoHijo ).removeClass( "hoverTag" );
				});
				
			}
		}
	});
	
}


