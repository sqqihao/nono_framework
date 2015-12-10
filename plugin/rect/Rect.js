
window.nono = window.nono || {};

nono.Rect = function( dom ) {

    this.dom = dom || document.body;
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.border = "1px dashed #ccc";
    this.bindEvents();

};

$.extend(nono.Rect.prototype , {
    "preventDefault" : function ( ev ) {

        ev.stopPropagation&&ev.stopPropagation();
        ev.preventDefault&&ev.preventDefault();
        ev.cancelable = true;
        ev.returnValue = false;

    },

    "bindEvents" : function () {

        //绑定上下文
        this.mousedownFn = this.mousedown.bind(this);
        this.mousemoveFn = this.mousemove.bind(this);
        this.mouseupFn = this.mouseup.bind(this);

        this.dom.addEventListener("mousedown", this.mousedownFn);

    },

    "unbindEvents" : function () {

        this.dom.removeEventListener("mousedown", this.mousedownFn);

    },

    "mousedown" : function (ev) {

        ev = ev || window.event;
        var _this = this;
        this.startX = ev.clientX;
        this.startY = ev.clientY;
        _this.dom.appendChild( this.div );
        //因为存在滚动条的情况;
        this.startOffsetLeft = -this.dom.getBoundingClientRect().left;
        this.startOffsetTop = -this.dom.getBoundingClientRect().top;
        this.dom.addEventListener("mouseup", this.mouseupFn);
        this.dom.addEventListener("mousemove", this.mousemoveFn);
        this.preventDefault(ev);

    },

    "mousemove" : function(e) {

        e = e || window.event;
        if(!this.div)return;
        var disX = e.clientX;
        var disY = e.clientY;
        var left = 0, top = 0, width = 0, height = 0;

        left = Math.min(e.clientX, this.startX)+this.startOffsetLeft;
        top = Math.min(e.clientY, this.startY)+this.startOffsetTop;
        width = Math.abs(this.startX-e.clientX);
        height = Math.abs(this.startY-e.clientY);

        this.div.style.left = left + "px";
        this.div.style.top = top + "px";
        this.div.style.width = width + "px";
        this.div.style.height = height + "px";
        this.preventDefault(e);

    },

    "mouseup" : function (ev) {

        ev = ev || window.event;
        this.dom.removeEventListener("mouseup", this.mouseupFn);
        this.dom.removeEventListener("mousemove", this.mousemoveFn);
        this.preventDefault(ev);

    }
});