function ClrPickerMod(){
    var mdlId = null;
    this.setModelId = function(id){
        mdlId = id;
    }
    this.getModelId = function(){
        return mdlId;
    }   
    
    var clrpView = null;
    this.start = function(view){
        clrpView = view;
    }
    this.UpdateModel = function(){
        if(clrpView)
            clrpView.Update(mdlId);
    }
    this.UpdColor = function(clr){
        if(clrpView)
            clrpView.UpdColor(clr,mdlId);
    }
}
function ClrPickerView(){
    var clrpModel = null;
    var clrpField = null;
    var clrpStProperty = null;
    var startTxt = null;

    this.start = function(model,field,style_property,start_text){
        clrpModel = model;
        clrpField = field;
        clrpStProperty = style_property;
        startTxt = start_text;

        clrPickerInput();
        closeAll();
    }
    var closeAll = function(){
        var palettes = document.getElementsByClassName('palette');
        var lg = palettes.length;
        for(var i = 0; i < lg; i++){
                palettes[i].style.display = 'none';
        } 
    }
    this.Update = function(id){
        if(window.getComputedStyle(document.getElementById('palette-' + id)).getPropertyValue('display') == 'none'){
            closeAll();
            document.getElementById('palette-' + id).style.display = 'block';
        } else{
            document.getElementById('palette-' + id).style.display = 'none'; 
        }          
    }
    this.UpdColor = function(clr,id){
        document.getElementById('color-'+id).value = clr;        
    }
    var clrPickerInput = function(){
        var coverDiv = document.createElement('div');
        coverDiv.className = 'clrp-cover';
        coverDiv.setAttribute('data-property',clrpStProperty);
        coverDiv.id = 'clrp-cover'+ Math.floor(Math.random() * 100);
        clrpModel.setModelId(coverDiv.id);
        var cvr = document.createElement('div');
        cvr.id = 'cvr-' + coverDiv.id;
        cvr.className = 'cvr';
        var clrpInput = document.createElement('input');
        clrpInput.id = 'color-'+ coverDiv.id;
        clrpInput.className = 'clrp';
        clrpInput.setAttribute('type','text');
        clrpInput.value = startTxt;
        clrpInput.setAttribute('readonly','readonly');

        var markerBtn = document.createElement('i');
        markerBtn.className = 'fa fa-caret-down';
        markerBtn.setAttribute('aria-hidden','true');

        cvr.appendChild(clrpInput);
        cvr.appendChild(markerBtn);
        coverDiv.appendChild(cvr);

        createPalette(coverDiv);
        clrpField.appendChild(coverDiv);

        document.getElementById('palette-'+ coverDiv.id).style.display = 'none';
    }
    var getColorsByRequest = function(cover,paletteCover){
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

        var xhr = new XHR();
        var xhr = new XMLHttpRequest();
        xhr.open('GET','json/colors.json',false);
        xhr.onload = function() {
            var baseColor = this.responseText;
            baseColor = JSON.parse(baseColor);

            var lg = baseColor.length;
            var colorItem;
        for(var i = 0;i < lg;i++){
            colorItem = document.createElement('div');
            colorItem.className = 'item';
            colorItem.setAttribute('data-color',baseColor[i]);
            colorItem.style.backgroundColor = baseColor[i];
            paletteCover.appendChild(colorItem);
        }
            cover.appendChild(paletteCover);
        }
        xhr.send();
    }
    var createPalette = function(cover){
        var paletteCover = document.createElement('div');
        paletteCover.className = 'palette';
        paletteCover.id = 'palette-'+ cover.id;
    if(window.location.protocol == 'file:'){
            var baseColor = ["#ffffff","#99CCCC","#99CCFF","#CC9999","#FF6633","#CCFFCC","#6699FF","#66CCFF","#CC9966","#CC99CC","#CCCCCC","#66CCCC","#3399FF","#CC6666","#CC3300","#99CC99","#3366FF","#33CCFF","#FF9966","#9966CC","#999999","#339999","#0099FF","#CC3333","#FF0000","#66CC66","#0000FF","#00CCFF","#CC3300","#9933CC","#666666","#669999","#6699CC","#993333","#CC0000","#669966","#0000CC","#3399CC","#993300","#990099","#333333" ,"#006666","#336699","#990033","#663300","#336633","#0033CC","#0099CC","#CC3300","#660066","#000000","#336666","#006699","#990000","#660000","#003300","#000033","#003333","#CC0000","#330033"];
            var lg = baseColor.length;
            var colorItem;
            for(var i = 0;i < lg;i++){
                colorItem = document.createElement('div');
                colorItem.className = 'item';
                colorItem.setAttribute('data-color',baseColor[i]);
                colorItem.style.backgroundColor = baseColor[i];
                paletteCover.appendChild(colorItem);
            }
            cover.appendChild(paletteCover);
    } else{
        getColorsByRequest(cover,paletteCover);
    }
    }
}
function ClrPickerController(){
    var clrpModel = null;
    var clrpField = null;
    var clrpStProperty = null;

    this.start = function(model,field,style_property){
        clrpModel = model;
        clrpField = field;
        clrpStProperty = style_property;

        selectClick();
        selectColor();
    }    
    var selectClick = function(){
        var selects = document.getElementById(clrpModel.getModelId()).querySelectorAll('.cvr');
        var lg = selects.length;
        for(var i = 0; i<lg; i++){
            selects[i].addEventListener('mousedown',
                function(){
                    var id = this.id.replace('cvr-',''); 
                    clrpModel.setModelId(id);
                    clrpModel.UpdateModel();
            });
        }
    }
    var selectColor = function(){
        var colors = document.getElementById(clrpModel.getModelId()).querySelectorAll('.item');
        var lg = colors.length;
        for(var i = 0; i < lg; i++){
            colors[i].addEventListener('click',function(){          
                var color = this.getAttribute('data-color');
                clrpModel.UpdColor(color);
                clrpModel.UpdateModel();
            });  
        }      
    }
}
function initColorPicker(field,style_property,start_text){
    var mdlColorPicker = new ClrPickerMod();
    var viewColorPicker = new ClrPickerView();
    var cntrlColorPicker = new ClrPickerController();
   
    mdlColorPicker.start(viewColorPicker);
    viewColorPicker.start(mdlColorPicker,field,style_property,start_text);
    cntrlColorPicker.start(mdlColorPicker,field,style_property);  
}
