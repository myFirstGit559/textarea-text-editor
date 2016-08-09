function FormattedTextC() {
    var textM = null;
    var buttonCover = null;
    var textArea = null;

    var selStr = null;
    var startIndex = null;

    this.start = function (Model, Cover, Text) {
        textM = Model;
        buttonCover = Cover;
        textArea = Text;

        textArea.select(getTextStr);

        btnsSmplEvent();
        btnsCmplxEvent();

        menuEvent();
        changeSize();
    }
    var getTextStr = function () {
       var selObj = window.getSelection && window.getSelection();
       var selRange;
        if (typeof window.getSelection()!='undefined' && selObj.rangeCount!=0){
             selRange = selObj.getRangeAt(0);
             selStr = selObj.toString();
        } else if( typeof document.selection != 'undefined'){ 
             selStr = document.selection.createRange().text;
        } else if(typeof window.getSelection() != 'undefined' && selObj.rangeCount==0){
             selRange = selObj.getRangeAt(0);
             selStr = selObj.toString();
}

      
        startIndex = textArea[0].selectionStart;
        endIndex = textArea[0].selectionEnd;   
 
    }
    var btnsSmplEvent = function(){
        var btnsSmpl = buttonCover.find('.btnsSmpl');
        btnsSmpl.click(function(event){
            newSmplStr($(this).attr('data-id'));
            event.preventDefault();
        });
    }
    var newSmplStr = function(index){
        if(selStr != null && !/^[^\da-zA-zа-яА-Я]+$/.test(selStr)){
            textM.UpdateView(startIndex,endIndex,index,textM.getSmplFrmtText(index));
        }
        selStr = null;
    }
    var btnsCmplxEvent = function(){
        var btnsCmplx = buttonCover.find('.btnsCmplx');
        btnsCmplx.click(function(event){
            newCmplxStr($(this).attr('data-quality'),$(this).attr('data-id'));
            event.preventDefault();
        });
    }
    var newCmplxStr = function(quality,index){
        if(selStr != null && !/^[^\da-zA-zа-яА-Я]+$/.test(selStr)){
            textM.seeWidgetDialog(startIndex,endIndex,quality,index);
        }
        selStr = null;
    }
    var menuEvent = function(){
        var menuElement = buttonCover.find('.menu');
        menuElement.hover(function(){
            $(this).toggleClass('active').find('.submenu-cover').toggle('slow');
        });
        var subMenu = buttonCover.find('.submenu');
        subMenu.hover(function() {
            $(this).find('.item-cover').toggle('slow');
        });
        var setElements = buttonCover.find('.item-cover>div');
        setElements.mousedown(function(){
            if($(this).attr('data-item')){
               newMenuStr($(this).attr('data-item'),0);                
            }

        });
    }
    var newMenuStr = function(value,index){
        if(selStr != null && !/^[^\da-zA-zа-яА-Я]+$/.test(selStr))
            textM.UpdateView(startIndex,endIndex,index,textM.createCoveredStr(value));        
        selStr = null;
    }
    var changeSize = function(){
        textM.showSpinner().on( "spinstop", function( event, ui ) {newChangeSize($(this).val());} );
    }
    var newChangeSize = function(size){
        if(typeof startIndex != 'undefined'){
            textM.UpdateSize(startIndex,endIndex,size); 
            selStr = null;
        }
        else{
            textM.UpdateSize(0,textArea.val().length,size);                  
        }
    }
}