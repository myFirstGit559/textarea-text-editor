var OMVC = {};

OMVC.makeObservableSubject = function () {
    var observers = [];
    var addObserver = function (o) {
        if (typeof o !== 'function') {
            throw new Error('observer must be a function');
        }
        for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
            var observer = observers[i];
            if (observer === o) {
                throw new Error('observer already in the list');
            }
        }
        observers.push(o);
    };
    var removeObserver = function (o) {
        for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
            var observer = observers[i];
            if (observer === o) {
                observers.splice(i, 1);
                return;
            }
        }
        throw new Error('could not find observer in list of observers');
    };
    var notifyObservers = function (data) {
        // Make a copy of observer list in case the list
        // is mutated during the notifications.
        var observersSnapshot = observers.slice(0);
        for (var i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
            observersSnapshot[i](data);
        }
    };
    return {
        addObserver: addObserver,
        removeObserver: removeObserver,
        notifyObservers: notifyObservers,
        notify: notifyObservers
    };
};


OMVC.Model = function () {
    var self = this;
    var currentColor = null;
    var currentStatus = null;
    self.modelChangedSubject = OMVC.makeObservableSubject();//to info view about changes
    if(window.location.protocol == 'file:'){
        self.baseColor = ["#ffffff","#99CCCC","#99CCFF","#CC9999","#FF6633","#CCFFCC","#6699FF","#66CCFF","#CC9966","#CC99CC","#CCCCCC","#66CCCC","#3399FF","#CC6666","#CC3300","#99CC99","#3366FF","#33CCFF","#FF9966","#9966CC","#999999","#339999","#0099FF","#CC3333","#FF0000","#66CC66","#0000FF","#00CCFF","#CC3300","#9933CC","#666666","#669999","#6699CC","#993333","#CC0000","#669966","#0000CC","#3399CC","#993300","#990099","#333333" ,"#006666","#336699","#990033","#663300","#336633","#0033CC","#0099CC","#CC3300","#660066","#000000","#336666","#006699","#990000","#660000","#003300","#000033","#003333","#CC0000","#330033"];
    } else{
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

        var xhr = new XHR();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'json/colors.json', true);
        xhr.onload = function() {
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                self.baseColor = this.responseText; 
                self.baseColor = JSON.parse(self.baseColor);
            }   
        }  
        xhr.send();  
    }
    self.toggleColorPicker = function(status){
        currentStatus = status;
        self.modelChangedSubject.notifyObservers();
    }
    self.changeColor = function(itemColor){
        currentColor = itemColor;
        self.modelChangedSubject.notifyObservers();
    }
    self.getCurrentColor = function(){
        return currentColor;
    }
    self.getCurrentStatus = function(){
        return currentStatus;
    }
};

OMVC.View = function (model, rootObject, clrpStProperty) {
    var self = this;

    self.coverDiv = document.createElement('div');
    self.coverDiv.className = 'clrp-cover';
    self.coverDiv.setAttribute('data-property', clrpStProperty);
    var cvr = document.createElement('div');
    cvr.className = 'cvr';
    var clrpInput = document.createElement('input');
    clrpInput.type = 'text';
    clrpInput.name = 'clrp';
    clrpInput.className = 'clrp';
    clrpInput.placeholder = clrpStProperty;
    clrpInput.setAttribute('readonly', 'readonly');

    var markerBtn = document.createElement('i');
    markerBtn.className = 'fa fa-caret-down';
    markerBtn.setAttribute('aria-hidden','true');

    cvr.appendChild(clrpInput);
    cvr.appendChild(markerBtn);
    self.coverDiv.appendChild(cvr);

    self.paletteCover = document.createElement('div');
    self.paletteCover.className = 'palette';
    var lg = model.baseColor.length;
    for(var i = 0;i < lg;i++){
        var colorItem = document.createElement('div');
        colorItem.className = 'item';
        colorItem.setAttribute('data-color',model.baseColor[i]);
        colorItem.style.backgroundColor = model.baseColor[i];
        self.paletteCover.appendChild(colorItem);
    }
    self.coverDiv.appendChild(self.paletteCover);
    rootObject.appendChild(self.coverDiv);
    model.modelChangedSubject.addObserver(
        function(){
            var color = model.getCurrentColor();
            var status = model.getCurrentStatus();
            if(status != null){
                switch(status){
                    case true:
                        self.paletteCover.style.display = 'block';
                        break;
                    case false:
                        self.paletteCover.style.display = 'none';
                        break;
                }
            }
            if(color != null){
               clrpInput.value = color;
            }
        }
    );
};

OMVC.Controller = function (model, view) {
    view.coverDiv.addEventListener('mouseenter',function(event) {
        model.toggleColorPicker(true);
    });
    view.coverDiv.addEventListener('mouseleave',function(event) {
        model.toggleColorPicker(false);
    });
    view.paletteCover.addEventListener('click',function(event) {
        var colorItem = event.target;
        model.changeColor(colorItem.getAttribute('data-color'));
    });

};        
function initColorPicker(cover, style_property){
    var model = new OMVC.Model();
    var view = new OMVC.View(model, cover, style_property);
    var controller = new OMVC.Controller(model, view);
}
/*window.addEventListener('load',function(){
    var model = new OMVC.Model();
    var view = new OMVC.View(model, document.body, 'color');
    var controller = new OMVC.Controller(model, view);

    var model1 = new OMVC.Model();
    var view1 = new OMVC.View(model1, document.body, 'background-color');
    var controller1 = new OMVC.Controller(model1, view1);
});*/