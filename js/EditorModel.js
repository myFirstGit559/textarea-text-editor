function FormattedTextM() {
    var textV = null;

    this.start = function (View) {
        textV = View;
    }

    this.UpdateView = function (start,end,index,tags) {
        if(textV)
           textV.Update(start,end,index,tags);
    }

    this.getSmplFrmtText = function(index){
         return textV.getSmplButtonsProperty()[index];     
    }


    this.seeWidgetDialog = function(start,end,quality,index){
        switch(quality){
            case 'email':
                textV.crtEmailDlg(start,end,index,quality);
                break;
            case 'link':
                textV.crtLinkDlg(start,end,index,quality);
                break;
            case 'list':
                textV.crtCountDlg(start,end,index,quality);
                break;
        }
    }
    
    this.createCoveredStr = function(value){
         if(value != '<hr>'){
            return [value,value.replace('<','</')];
         } else{
            return [value,''];
        }
    }
    this.showSpinner = function(){
        return textV.getSpinner();
    }
    this.UpdateSize = function(start,end,size){
        textV.setTextSize(start,end,size);
    }
    
}
function initEditor(btnsArea,txtArea){
    var frmtTextM = new FormattedTextM();
    var frmtTextV = new FormattedTextV();
    var frmtTextC = new FormattedTextC();

    frmtTextM.start(frmtTextV);
    frmtTextV.start(frmtTextM, btnsArea, txtArea);
    frmtTextC.start(frmtTextM, btnsArea, txtArea);  
}
//