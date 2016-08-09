function FormattedTextV() {
    var textM = null;
    var buttonCover = null;
    var textArea = null;

    var fldName = null;
    var newStr = null;

    var spinner = null;

    var simpleButtons = [
        { button: ["<i class='fa fa-bold fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], b: ''},
        { button: ["<i class='fa fa-italic fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], em: ''},
        { button: ["<i class='fa fa-underline fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], span: 'text-decoration:underline;'},
        { button: ["<i class='fa fa-strikethrough fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], span: 'text-decoration:line-through;'},
        { button: ["<i class='fa fa-align-left fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], p: 'text-align:left;'},
        { button: ["<i class='fa fa-align-center fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], p: 'text-align:center;'},
        { button: ["<i class='fa fa-align-justify fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], p: 'text-align:justify;'},
        { button: ["<i class='fa fa-align-right fa-lg ' aria-hidden='true'></i>",'btnsSmpl'], p: 'text-align:right;'},
        { button: ["<i class='fa fa-list-ol fa-lg ' aria-hidden='true'></i>",'btnsCmplx','list'], 
          ul:{style:'list-style-type:decimal;', action:'Enter the number of list items:'}
        },
        { button: ["<i class='fa fa-list-ul fa-lg ' aria-hidden='true'></i>",'btnsCmplx','list'],  
          ul:{style:'list-style-type:disc;', action:'Enter the number of list items:'}
        },
        { button: ["<i class='fa fa-envelope-o fa-lg ' aria-hidden='true'></i>",'btnsCmplx','email'], 
          a:{attr:"href = 'mailto:", action:'Enter email:'}
        },
        { button: ["<i class='fa fa-link fa-lg ' aria-hidden='true'></i>",'btnsCmplx','link'], 
          a:{attr:"href =' ", action:'Enter link:'}
        }
    ];    
    var menuBtns = {tag:"<div class = 'menu'>Formats <i class='fa fa-caret-down' aria-hidden='true'></i></div>",children:[
    {tag:"<div class = 'submenu'>Heading <i class='fa fa-caret-right' aria-hidden='true'></i></div>",children:[
                { Heading1:'<h1>'},
                { Heading2:'<h2>'},
                { Heading3:'<h3>'},
                { Heading4:'<h4>'},
                { Heading5:'<h5>'},
                { Heading6:'<h6>'}
    ]},
    {tag:"<div class = 'submenu'>Blocks <i class='fa fa-caret-right' aria-hidden='true'></i></div>",children:[
                { Paragraph:'<p>'},
                { Span:'<span>'},
                { Quote:'<q>'},
                { ListElement:'<li>'},
                { HorisontalLine:'<hr>'},
    ]}
    ]
};

    var buttonsSmplProperty = new Array();
    var cmplxProp = new Array();

    this.start = function (Model,Cover,Text) {
        textM = Model;
        buttonCover = Cover;
        textArea = Text;
        createMenu();
        buttonCover.append("<span class='text-size'>Text size:<input id='spinner' name='value' value= 10 readonly> px</span>");
        setSpinner();

        addButtons(simpleButtons);
        addSmplActions();

        initColorPicker(buttonCover[0],'background-color','bg color');
        initColorPicker(buttonCover[0],'color','text color');
    }
    this.Update = function (start,end,index,tags) {
        var newCont;
        newCont = textArea.val().slice(0,start) + tags[0]+ textArea.val().slice(start,end)+tags[1]+textArea.val().substr(end,textArea.val().length);
        textArea.val(newCont);
    }
    var addButtons = function (btns) {        
            $.each(btns,function(index,item){
                if('button' in item){
                    var btnEl = $('<button>');
                    var icon = $(item['button'][0]);
                    btnEl.addClass(item['button'][1]);
                    btnEl.append(icon);
                    
                    if(typeof item['button'][2] != 'undefined'){
                        btnEl.attr('data-quality',item['button'][2]);
                        btnEl.attr('data-id',(index));
                    } else {
                        btnEl.attr('data-id',index);
                    }

                    buttonCover.append(btnEl);
                }
            });        
    }
    var createMenu = function(){
        var menu;
        $.each(menuBtns,function(key,value){
            switch(key){
                case 'tag':
                    menu = $(value);
                    break;
                case 'children':
                    var sbmnCover = $("<div class='submenu-cover'>");
                    $.each(value, function(index,item){
                        var sbmn;
                        for(var keys in item){
                            switch(keys){
                                case 'tag':
                                    sbmn = $(item[keys]);
                                    break;
                                case 'children':
                                var itemCover = $("<div class='item-cover'>");
                                    $.each(item[keys],function(i,el){
                                        for(var k in el){
                                            var lstItm = $("<div data-item ='" + el[k]+"'>"+k+"</div>");
                                            itemCover.append(lstItm);                                 
                                        }
                                    });
                                    sbmn.append(itemCover);
                                    sbmnCover.append(sbmn);
                                    break;
                            }
                        }

                    });
                    menu.append(sbmnCover);
                    break;
            }
        });
        buttonCover.append(menu);
    }
    var addSmplActions = function(){
            $.each(simpleButtons,function(index,item){
                for (tag in item) {
                    switch(tag){   
                        case 'span':
                            buttonsSmplProperty[index] = ["<"+ tag + " style='" + item[tag] + "'>","</" + tag + ">"];
                            break;
                        case 'p':
                            buttonsSmplProperty[index] = ["<"+ tag + " style='" + item[tag] + "'>","</" + tag + ">"];
                            break;                   
                        default:
                            buttonsSmplProperty[index] = ["<"+ tag + ">","</" + tag + ">"]; 
                            break;
                    }
                }
            });
    }

    this.getSmplButtonsProperty = function(){
        return buttonsSmplProperty;
    }

    var UpdateCmplx = function(start,end,index){
                if(cmplxProp[index]){
                    for (tag in simpleButtons[index]) {
                        switch(tag){  
                            case 'ul':
                                var li = '\t<li>'+ textArea.val().slice(start,end) +'</li>\n';
                                for (var i = 1; i < cmplxProp[index]; i++)
                                    li += "\t<li></li>\n";
                                newStr = "\n<"+ tag + " style='" + simpleButtons[index][tag]['style'] + "'>\n"+li+"</" + tag + ">\n"; 
                                var newCont = textArea.val().slice(0,start) + newStr + textArea.val().substr(end,textArea.val().length);
                                textArea.val(newCont); 
                                break;
                            case 'a':
                                newStr = "<"+ tag +" target = '_blank' " + simpleButtons[index][tag]['attr']+ cmplxProp[index]+"'>"+ textArea.val().slice(start,end)+ "</" + tag + ">";
                                var newCont = textArea.val().slice(0,start) + newStr +textArea.val().substr(end,textArea.val().length);
                                textArea.val(newCont);
                                break;                   
                        }
                    }
                }
    }

    var updateTips = function(t) {
        var tips = $('#error-popup-field');
        tips.text(t);
    }
    var checkRegexp = function(o, regexp, n){
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips(n);
        return false;
      } else {
        return true;
      }
    }
    this.crtLinkDlg = function(start,end,index,fldName){
        createDialog(
            'linkID',
            simpleButtons[index]['a']['action'],
            function(){
                var valid = true;
                $(this).find($('#'+fldName)).removeClass('ui-state-error');
                valid = valid && checkRegexp( $(this).find($('#'+fldName)), /^(https?:\/\/)?([\w\.-]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/, "Enter valid URL http(s)://example.ex." );
                if(valid){
                    cmplxProp[index] = $(this).find($('#'+fldName)).val();
                    UpdateCmplx(start,end,index);
                    $(this).dialog( "close" );
                }
            },
            fldName);

    }
    this.crtCountDlg = function(start,end,index,fldName){
        createDialog(
            'listID',
            simpleButtons[index]['ul']['action'],
            function(){
                var valid = true;
                $(this).find($('#'+fldName)).removeClass('ui-state-error');
                valid = valid && checkRegexp( $(this).find($('#'+fldName)), /^[1-9]{1}$/, "Enter valid number from 1 to 9." );
                if(valid){
                    cmplxProp[index] = $(this).find($('#'+fldName)).val();
                    UpdateCmplx(start,end,index);
                    $(this).dialog( "close" );
                }
            },
            fldName);        
    }
    this.crtEmailDlg =function(start,end,index,fldName){
        createDialog(
            'emailID',
            simpleButtons[index]['a']['action'],
            function(){
                var valid = true;
                $(this).find($('#'+fldName)).removeClass('ui-state-error');
                valid = valid && checkRegexp( $(this).find($('#'+fldName)), /^[\w-_\.\d]+@[a-z]+\.[a-z]{2,6}/, "Enter valid email." );
                if(valid){
                    cmplxProp[index] = $(this).find($('#'+fldName)).val();
                    UpdateCmplx(start,end,index);
                    $(this).dialog( "close" );
                }
            },
            fldName);  
    }
    var setSpinner = function(){
        spinner = $( "#spinner" ).spinner({
            min:10,
            max:60,
            step:1,
            numberFormat: "n",
        });

    }
    this.getSpinner = function(){
        return spinner;
    }
    var oldStart,oldEnd;
    this.setTextSize = function(start,end,size){
        oldstart = start;
        var leftSide = "<span style = 'font-size:"+size+"px'>";
        var rightSide = "</span>";
    if(textArea.val().indexOf('font-size:',(start - leftSide.length)) == -1){
        var newCont = textArea.val().slice(0,start) + leftSide + textArea.val().slice(start,end) + rightSide + textArea.val().substr(end,textArea.val().length);
        textArea.val(newCont);  
        oldStart = start;
        oldEnd = end; 
    } else if(oldstart < (oldStart-leftSide.length)){
        var newCont = textArea.val().slice(0,start) + leftSide + textArea.val().slice(start,end) + rightSide + textArea.val().substr(end,textArea.val().length);
        textArea.val(newCont); 
        oldStart = start;
        oldEnd = end;     
    } else{
        start = textArea.val().indexOf('font-size:',(start - leftSide.length))+'font-size:'.length;
        end = start + 2;
        var newCont = textArea.val().slice(0,start) + size + textArea.val().substr(end,textArea.val().length);
        textArea.val(newCont); 
    }     
  
    }
    var createDialog = function(id,title,takeValue,fldName){
        var popupDiv = $('<div>').attr('id',id);
        var errorP = $('<p>.</p>').attr('id','error-popup-field');
        var form = $('<form>');
        var input = $('<input>')
            .attr({
                type: 'text',
                name: fldName,
                id: fldName,
                plaseholder: fldName
            })
            .addClass("text ui-widget-content ui-corner-all");
        var sbmBtn = $('<input>')
            .attr({
                type: 'submit',
                tabindex: -1,
                style:"position:absolute; top:-1000px"
            });
        form.append(input).append(sbmBtn).append(errorP);
        popupDiv.append(form);
              
        buttonCover.append(popupDiv);

        $('#'+ id).dialog({
            buttons: {
                "Add": takeValue,
                 Cancel: function() {
                 $(this).dialog( "close" );
                }
            },          
            close: function() {
                if(form)
                    form[0].reset();
                    popupDiv.remove();
                },
            draggable:true,
            width:290,
            resizable: false,
            modal:true,
            title:title,
            autoOpen: true
        });
    }
    this.UpdateColor = function(start,end,id,clr){
        var clrpStProperty = $('#'+ id).attr('data-property');
        var str_html = textArea.val().slice(start,end);
        var new_str;
        var reg = /[<>\/]/g;
        if(str_html.search(reg)==-1){
            new_str="<span style='" + clrpStProperty + ':' + clr + "'>" + str_html + "</span>";
            textArea.val(textArea.val().slice(0,start) + new_str + textArea.val().slice(end));
        } else{
            var reg_x = new RegExp("<span style='(color|background-color)");
            old_span=textArea.val().slice(textArea.val().search(reg_x),textArea.val().lastIndexOf('</span>')+7);
            new_str = old_span;
            var reg = new RegExp('([^-]'+clrpStProperty+'){1}','g');
            if(old_span.search(reg) == -1){
                new_str = new_str.replace("<span style='","<span style='" + clrpStProperty + ':' + clr +'; ');
                textArea.val(textArea.val().replace(old_span,new_str));
            } else {
                var start_new = old_span.search(reg) + 1;
                var end_new = start_new + clrpStProperty.length + 8;
                var old_str = old_span.slice(start_new,end_new);
                textArea.val(textArea.val().replace(old_str,clrpStProperty + ':' + clr));                
            }
        }
    }
}
