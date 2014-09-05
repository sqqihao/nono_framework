/*
var $ = function(arg) {
	
};
*/
l = function(arg) {
	console&&console.log(arg);
};
var f = function(str, context) {
	return new f.prototype.i( str ,context );
};
f.map = function( arg ,fn ) {	
	var result = [];
	var type =  Object.prototype.toString.call(arg).slice(8,-1).toLowerCase();
    if( arg instanceof f ) {
        for(var i=0; i<arg.length; i++) {
            if(fn)result.psush( fn( arg[i] , Number(i) ));
        };
        return
    };
	for(var index in arg) {
		if( type === "object" ) {
			if(fn)result.push( fn( index, arg[index] ) );
			if(!fn)result.push(arg[index]);
		}else if( type === "array"&&(Number(index)) === (Number(index)) || arg instanceof f ) {
			if(fn)result.push( fn( arg[index] ) );
			if(!fn)result.push(arg[index]);
		}
	};
	return result;
};
//for in 循环里面的key 一直是字符串,for in 循环数组的时候要注意 
f.each = function( arg ,fn) {
	var type =  Object.prototype.toString.call(arg).slice(8,-1).toLowerCase();
    if( arg instanceof f ) {
        for(var i=0; i<arg.length; i++) {
            fn( arg[i] , Number(i) );
        };
        return
    };
	for(var index in arg) {
		if ( type === "array"&&(Number(index)) === (Number(index))  ) {
			fn( arg[index] , Number(index) );
		}else if( type === "object" ) {
			fn( index, arg[index] );
		};
	};
};
/*
"number string object function array boolean null".replace(/[\w]+\s/ig, function( type ) {
	f["is"+type.substring(0,1).toUpperCase()+type.substr(1) ] =  function( arg ) {
		return Object.prototype.toString.call(arg).slice(8,-1);
	};
});
*/
f.each("number string object function array boolean null".split(" "), function(type){
	f["is"+type.substring(0,1).toUpperCase()+type.substr(1) ] =  function( arg ) {
		return Object.prototype.toString.call(arg).slice(8,-1).toLowerCase() === type;
	};
});
f.toArray = function(arg) {
	var i = 0; len = arg.length ,result = [];
	for( ;i<len; i++) {
		arg[i]!==undefined && result.push( arg[i] );
	};
	return result;
};
f.trim = function(str) {
	var reg = /^\s+|\s+$/gi;
	return str.replace(reg,"");
};

/*
var f1 = function( arg1, arg2 ,arg3 ,arg4){console.log(arg1+arg2+arg3+arg4)};
f.proxy(f1, f, 1, 2)(3,4)
*/
f.proxy = function(fn, context) {
	var arg = Array.prototype.slice.call(arguments).slice(2);
	return function() {
		var argInner = Array.prototype.slice.call(arguments)
		fn.apply(context, arg.concat( argInner ));
	};
};

/*
* param :第一个参数可以为布尔值，表示覆盖目标值， 第二个参数为目标对象， 第三个参数开始起为要继承的对象整个列表;
*/
f.extend = function() {
	var arg = Array.prototype.slice.call( arguments ),
		i = 1 ,
		reW = false,
		target = arg[0];
		
	if( typeof arg[0] === "boolean" )
		reW = arg[0], i = 2, target = arg[1];
		
	for(; i< arg.length; i++) {
		var source = arg[i];
		for(var prop in source) {
			if( typeof source[prop] === "object" ) {
				f.extend(reW , target , source[prop])
			};
			if( target[prop] === undefined ) {
				target[prop] = source[prop];
			}else{
				if(reW) {
					target[prop] = source[prop]
				}else{
					//rew为假的时候就不复写了
				};
			};
		};
	};
	return target;
};

f.extend(true,f,{
    extend__proto__ : function( prototype ) {
        var Fn = function() {};
        Fn.prototype = prototype;
        return new Fn;
    }
});
//基础数组的原型;
f.prototype = f.extend__proto__(Array.prototype);

f.readyList = [];
//debugger;
var regFrag = /^\s*<(\w+|!)[^>]*>/;
//正则; \1
var regFullFrag =  /^\s*<(\w+|!)[^>]*>\w+<\/\1>/ ;
var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
f.extend(f.prototype, {
	i : function(str,context) {
		if(typeof str === "function") {
			f.readyList.push( str );
			return this;
		};
		if( str instanceof f ) {
            var eEl = str
			return this;
		};
		
		if( str.nodeType && str.nodeType === 9){
            this.push( str )
			return this;
		};
		
		if( str.top && str.self && str.window ) {
            this.push( str )
			return this;
		};
		
		if( !context ) context = document;
		
		if(str.nodeType===1) {
            var el = str;
			this.push( el );
			return this;
		};
        //如果是单标签;
        if( str.match( singleTagRE ) ) {
            if( RegExp.$1 ) {
                var dom = document.createElement( RegExp.$1 );
                if(typeof context === "object" && context.nodeType !== 9) {
                    var attr = context;

                    var attrHook = {
                        style : function( val) {
                            //debugger
                            f(this).style( val );
                        },
                        "class" : function( val ) {
                            //debugger;
                            f(this).addClass( val );
                        },
                        html : function(val) {
                            f(this).html(val);
                        }
                    };

                    for(var p in attr) {
                        //debugger;
                        if( attrHook[p] !== void 0 ) {
                            attrHook[p].call(dom,attr[p] );
                        }else{
                            dom.setAttribute( p , attr[p] );
                        };
                    };
                };
                this.push( dom )
                return this;
            };
        };
        //如果是全标签;
        if( str.match(regFullFrag) ) {
            var dom = f("<div>");
            dom[0].innerHTML = str;
            dom = dom[0].children[0];
            if(dom) {
                this.push(dom);
                return this;
            };
        };

		if(str.indexOf("#")==0) {
			this.push( context.getElementById( str.substring(1) ) );
		}else if(str.indexOf("\.")===0) {
			if( context.getElementsByClassName ) {
				//this.el = Array.prototype.concat.call( document.getElementsByClassName( str.substring(1) ) ,[]);
                //debugger;
                var arr = f.toArray( context.getElementsByClassName( str.substring(1) )),
                    len = arr.length,
                    i = 0;
                do{
                    this.push( arr[i] );
                }while( i++, i<len )
				//this.push( Array.prototype.concat.call([]) );
                return this;
			}else{
                //debugger;
				var className = str.substring(1),
					//result = [],
					regClass = new RegExp("\\b"+className+"\\b","gi");
				var allEl = context.getElementsByTagName("*");
				for(var i = 0, len = allEl.length; i < len ; i++) {
					var selectorEl = allEl[i];
					selectorEl.className.search(regClass) !== -1 && this.push( selectorEl );
				};
                return this;
				//this.el = f.toArray( result );
				//this.el = [ this.allClass( str.substring(1) ) ];
			}
		}else{
            var arr =  f.toArray( context.getElementsByTagName(str) ),
                len = arr.length,
                i = 0;
            do{
                this.push( arr[i] );
            }while( i++, i<len )
            //this.push( Array.prototype.concat.call([]) );
            //debugger;
            return this;
		};
	},
	size : function() {
		return this.length;
	},
	noop : function() {
		
	},
	map : function( fn ) {
        //这个map没了;
		this.el = f.map(this, fn);
	},
	each : function( fn ) {
		var i = 0,
			len = this.length;
		for(; i<len; i++) {
			fn.apply(this[i], [i, this[i]]);
		};
		return this;
	},
	reverseEach : function( fn ) {
		var len = this.length;
		while( --len ) {
			fn.call(this[len], len, this[len])
		};
		return this;
	},
	first : function() {
		return this[0];
	},
	last : function() {
		return this[ this.size()-1 ];
	},
	eq : function(num) {
		if(num<0)num+=this.length;
		return this[num];
	},
	"class" : function() {
		return this.first().className;
	},
	hasClass : function(arg) {
		return this.first().className.indexOf(arg)!==-1 ? true : false;
	},
	addClass : function(arg) {
		this.each(function(i, e) {
			l( f(e).hasClass(arg) )
			if( !f(e).hasClass(arg) ) {
				e.className = f.trim( e.className+" "+arg );
			}
		});
	},
	removeClass : function(arg) {
		this.each(function(i, e) {			
			if(!arg) {
				e.className = "";
			}else{
				if( !f(e).hasClass(arg) )return;
				if(e.className.indexOf( arg )!=-1) {
					if( e.className.split(" ").indexOf( f.trim(arg) ) !== -1) {
						e.className = e.className.replace(new RegExp(f.trim(arg),"gi"), "");
					};
				};
			};
		});
	},
	replaceClass : function(arg, arg2) {
		(!arg2)&&(arg2 = "");
		this.each(function(i, e) {
			if( f(e).hasClass(arg) ) {
				e.className = e.className.replace(new RegExp(f.trim(arg),"gi"),arg2);
			};
		});
	},
	toggleClass : function(arg) {
		this.each(function(i, e) {
			if( f(e).hasClass(arg) ) {
				f(e).removeClass( f.trim(arg) );
			}else{
				f(e).addClass( f.trim(arg) );
			}
		});
	}
});

var proto = f.prototype.i.prototype = f.prototype;
f.extend(true,f,{
	isEmptyObject : function(obj) {
		for(var p in obj) {
			return false;
		};
		return true;
	},
	error : function( msg ){
		throw new Error(msg);
	}
});

//cookie在CHROME下本地测试不了，用FF测试;
f.extend(true,f,{
	//cookie
	ck : function( name ) {
		if(!name) {
			return document.cookie
		};
		if(typeof name === "string") {
			return gc(name);
		};
	},
	//getCookie
	gc : function(name) {
		var c = document.cookie.split(";");
		for(var i=0,len = c.length; i< len; i++ ) {
			var both = c[i].split("=");
			if( f.trim(name) === f.trim(both[0]) ) {
				return both[1];
			};
		};
	},
	//setCookie
	//({name : "nono"} , 1)
	sc : function(  ) {
		var arg = Array.prototype.slice.call(arguments);
        if( typeof arg[1] !== "number" ) {
            //如果没给时间就是一天;
            arg[1] = new Date( new Date().getTime()+86400*1000 );
        };
			//传JSON或者字符串只会接受第一个cookie，我要看看是为什么;
		if(typeof arg[0] === "object") {
			for(var p in arg[0]) {
                var temp = "";
				temp += (p+"="+arg[0][p]+"; ");
                document.cookie = (temp + "; expires=" + new Date(new Date().getTime()+(arg[1]*3600*1000)).toGMTString());
			};

			return f.ck();
		};
        //用这种写法总是出现就写了userID一个cookie;我感觉是我写的方式不对...
        //document.cookie="userId=828; userName=hulk; expire="+new Date().toGMTString();
		if(typeof arg[0] === "string") {
            var arr = arg[0].split(";");
            for(var i= 0, len = arr.length; i<len; i++) {
                var cookieTemp = arr[i].split("=");
                document.cookie = f.trim(cookieTemp[0])+"="+f.trim(cookieTemp[1]) + "; expires=" + new Date(new Date().getTime()+(arg[1]*3600*1000)).toGMTString();
            };
			return f.ck();
		};
	},
	//delCookie
	dc : function( name ) {
		if(name) {
			console.log(name);
			name = new String(name);
			//这个传JSON不行哦;
			f.sc(name+"=0", 0 );
		};
		if(!name) {
			var c = document.cookie.split(";");
			for(var i=0,len = c.length; i< len; i++ ) {
				var both = c[i].split("=");
				f.dc( f.trim(both[0]) );
			};
		};
		return f.ck();
	}
});
div1 = f("#div1");
//属性模块
f.extend(true,f.prototype,{
	attr : function( name , val ) {
		//设置;,有两种情况name有值，name是json的情况;
        var isObj;
		if( val  || (isObj = f.isObject( name ))) {
			f.each(this,function(e){
                if( val ) e.setAttribute(name, val);
                if(isObj) {
                    f.each(name,function( key,value ) {
                        e.setAttribute(key, value);
                    });
                };
			});
			return this;
		};
		
		//获取
		var arr = [];
		f.each(this,function(e){
			arr.push(e.getAttribute(name));
		});
		return arr.length === 1 ? arr[0] : arr;
	},
	
	attrs : function() {
		return this.first().nodeType === 1 && this.first().attributes;
	},
	
	removeAttr : function( name ) {
		if( name ){
			f.each(this, function(e) {
				e.removeAttribute( name );
			});
			return this;
		};
		
		//f.prototype.removeAttr.call(this)
	},

    style : function(val) {

        if( val ){
            f.each(this, function(e) {
                //debugger;
               if( typeof e.style.cssStyle !== void 0) {
                   e.style.cssStyle = val;
               };
                if( typeof e.style.cssText !== void 0) {
                   e.style.cssText = val;
                };
            });
            return this;
        };
    },

	//l( f("#div1").html(111111111) );
	html : function(str) {
		if(str) {
			f.each(this,function(e){
				e.innerHTML = str;
			});
			return this;
		};
		//获取第一个
		return this.first().innerHTML;
	},
	
	text : function( str ) {
        if(str) {
            f.each(this,function(e){
                e.textContent && (e.textContent = str);
                e.innerText && (e.innerText = str)
            });
            return this;
        };
        //获取第一个
        return this.first().textContent || this.first().innerText;
	}
});

//样式模块;
f.camelize = function( arg ) {
	return arg.replace(/(-\w)?/gi,function(a){ return a.split("-").pop().toUpperCase() })
};
f.extend(true,f.prototype,{
	css : function(key,val) {
		var el = this.first();
		var result = "";
        var setStyle = function(key,val) {
            if(typeof val === "number")val += "px";
            el.style[key] = val;
            return this;
        };

        //Object;
        //debugger;
        if( f.isObject( key) ) {
            f.each(key, function(k,v) {
                //debugger;
                setStyle(k,v);
            });
            return this;
        }if(val !== void 0 ){
            setStyle(key,val);
            return this;
        }else{
            //如果是读取style;，现在就只有读取样式的情况了;
            var key = f.camelize(key);
            //有问题
            //if( el.style[key] ) result = el.style[key];
            if( window.getComputedStyle ) result = window.getComputedStyle(el,false)[key];
            if( el.currentStyle ) result = el.currentStyle[key];
            //NaN or AUTO;
            if(result !== result || result === "auto" ){
                return 0;
            };
            return result
        };
	}
});

//缓存模块
f.uuid = 0;
f.cache = {};

f.extend(true,f.prototype,{
	data : function( key, val ) {
		var el = this[0];
		el.uuid = el.uuid || ++f.uuid;
		var datas = f.cache[ el.uuid ] = f.cache[ el.uuid ] || {};
		if( val ) {
			datas["el"] = el;
			datas[key] = val;
			return this;
		}else{
			return datas[key];
		};
		return this;
	},
	val : function( val ) {
		if( "value" in this.first() ){		
			if(val){
				this.first().value = val
			}else{
				return this.first().value;
			};
		};
		return this;
	}
});
var i = f("#ipt1");
var div1 = f("#div1");
//DOM节点操作模块;
f.extend(true, f.prototype,{

	append : function( target ) {
        //debugger;
		if( typeof target == "object" && target.nodeType === 1 ) {
			this.first().appendChild( target );
		}else if(target instanceof f){
			this.first().appendChild( target.first() );
		};
		return this;
	},

	insertBefore : function( target ) {
		var parent = this.first().parentNode;
		if( typeof target == "object" && target.nodeType === 1 ) {
			parent.insertBefore(this.first() ,target);
		}else if(target instanceof f){
			parent.insertBefore(target.first() , this.first() );
		};
		return this;
	},

	after : function( target ) {
		var parent = this.first().parentNode;
		if( typeof target == "object" && target.nodeType === 1 ) {
			parent.insertBefore(target, this.next().first());
		}else if(target instanceof f){
			parent.insertBefore(target.first(), this.next().first());
		};
	},

    prePend : function( target ) {
        //debugger;
        var _this = this.first().children[0];
        f(_this).insertBefore( target );
    },

	remove : function() {
		f.each(this.el, function(el , index) {
			el.parentNode.removeChild( el );
		});
	},

	next : function() {
		var el = this.first();
		while( el = el.nextSibling  ) {
			if(el.nodeType === 1)break;
		};
		return f(el);
	},

	prev : function() {
		var el = this.first();
		while( el = el.previousSibling  ) {
			if(el.nodeType === 1)break;
		};
		return f(el);
	},

	children : function( index ) {
		var els = "";
		//children不标准，但是全兼容哦;
        if(index === void 0){
            if( els = this.first().children ){
                return els;
            };
        };

        if( isFinite(index) ) {
            return this.first().children[index];
        };
	},

	parent : function() {
		var obj = this.first().parentNode;
		return obj ? f(obj) : document;
	},

	wrap : function( obj ,attr ) {
		if( typeof obj === "string" && typeof attr === "object" ) {
			var target = f(CE(obj, attr));
		}else if( obj.nodeType===1 || obj instanceof f ) {
			target = f( obj );
		};	
		this.parent().append( target );
		target.append( this.first() );
	},

	clone : function( b ) {
		if( typeof b === "boolean" ) {
			if(b) {
				return f( this.first().cloneNode(true) );
			}else{
				return f( this.first().cloneNode(false) );
			};
		};
	},

	contain : function( obj ) {
		var parent, 
			obj = (typeof obj === f) ? f.first() : obj&&obj.nodeType === 1 ? obj : "",
			_this = this.first();
			
		while( obj ) {
			if( obj.nodeName.toLowerCase() === "body" )return false;
			if( obj.parentNode === _this )return true;
			obj = obj.parentNode;
		};
	}
});

//事件模块;DOM1;
f.extend(true,f.prototype,{
	bind : function( type, fn ) {
		f.each(this,function(e){
			var events = e.events = e.events || {};
			events[type] = events[type] || [];
			//如果刚开始有绑定事件的话就走这个
			if(  e["on"+type] !== f.prototype.trigger ) {
				events[0] = e["on"+type];
			};
			
			e["on"+type] =  function(ev) {
                f.prototype.trigger.call(e,ev,type);
            };
			
			events[type].push( fn );
		});
		return this;
	},
	
	trigger : function( ev, type ) {
		//l(arguments);
		//走这边说明是手动触发的;
		if( typeof ev !== "object" ) {
			type = ev;
			ev = "";
			this.trigger.call(this.first() ,{} , type);
		};
		
		var events = this.events = this.events || {};
		events[type] = events[type] || [];
		for(var i=0, len = events[type].length, fns = events[type]; i<len; i++) {
			fns[i].call(this,ev);
		}; 
	},
	
	removeBind : function(type) {
		if(typeof type === "string") {
			f.each(this,function(e){
				var events = e.events = e.events || {};
				events[type] = events[type] || [];
				//直接清空事件的列表;
				events[type] = [];
			});
		};
		if(typeof type === "function") {
			f.each(this,function(e){
				var events = e.events = e.events || {};
				//循环事件列表
				for(var p in events) {
					if( events.hasOwnProperty(p) ) {
						var evevntsFnList = events[p] || [];
						//循环事件
						for(var i=0, len = evevntsFnList.length; i<len; i++) {
							if( evevntsFnList[i] == type ) {
								evevntsFnList[i] = function(){};
							};
						};
					};
				};
			});
		};
	}
	
});

//div1.bind("click",function(){alert(2)})
//事件模块;DOM2;
f.extend(true,f.prototype,{
	bind2 : function(ev, fn, capture) {
		capture = capture || false;
		if( document.addEventListener ) {
			this.el[0].addEventListener(ev, fn, false);
		}else if( obj.attachEvent ) {
			this.el[0].attachEvent("on"+ev , f.proxy(fn ,this.el[0]));
		}else{
			this.el[0]["on"+ev] = fn;
		};
	},
	unbind2 : function(ev, fn) {
		if( document.addEventListener ) {
			this.el[0].removeEventListener(ev, fn, false);
		}else if( obj.attachEvent ) {
			this.el[0].detachEvent("on"+ev , fn);
		}else{
			this.el[0]["on"+ev] = fn;
		};
	}
});

//shadow_box,返回沙盒的 doc和 win;
f.extend(true,f,{
	shadow : function( fn ) {
		var eIfr = CE("iframe");
		f("body").append( eIfr );
		f( eIfr.contentDocument ,eIfr.contentWindow || eIfr.contentDocument.window);
	}
});

//exec和test
//ua嗅探
f.extend(true,f,{
	browers : (function( ua ){		
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	})( navigator.userAgent.toLowerCase() ),
	
	prefix : function( node, name ) {
		if( node instanceof f ) node = node.first();
		//camelize
		var namePre = ["-webkit-","-moz-","-ms","-o",""],
			i = 0;
		do{
			if( f.camelize( namePre[i]+name ) in node ) {
				return true;
			};
			i++;
		}while( i < namePre.length );
		
		return false;
	}
});
//浏览器能力检测
f.extend(true,f.prototype,{
	hasKey : function( name ) {
		var el = this.first();
		f.prefix(el, name);
	}
});

//动画模块
f.extend(true,f,{
	move : function(node, time, json) {
		var defaultMove = time;
		if( node instanceof f ) node = node.first();
		if( typeof time === "object" ) {
			json = time;
			defaultMove = "swing";
		}else if((typeof time !== "object") && json === undefined){
			throw new Error();
		};
		clearInterval( node.timer );
		
		switch(typeof defaultMove){
			case "string" :
				//swing
				//linear
				/////////////////////////////////////
				node.timer = setInterval(function() {
					var initVal = "",
						speed = "",
						flag = true,
						opacity = "";
					//遍历属性
					for(var p in json) {
						//获取初始的属性值;
						if( p === "opacity" ) {
							//filter:alpha(opacity:10);
							initVal =  f(node).css(p) ;
							if(defaultMove == "swing"){
								speed = Math.ceil( ( json[p]*100 - initVal*100 )*.1 );
							}else{
								speed = Math.ceil( ( json[p]*100 - initVal*100 )/10 );
							};
						}else{
							initVal = parseInt( f(node).css(p) );
							if(defaultMove == "swing"){
								speed = Math.ceil( ( json[p] - initVal )*.1 );
							}else{
								speed = Math.ceil( ( json[p] - initVal )/10 );
							};
						};
						//speed = 10;
						if( p === "opacity" ) {
							node.style["opacity"] = (speed + initVal*100)/100;
						}else{
							 node.style[p] = (speed + initVal ) + "px";
						}
					  if(  parseInt( f(node).css(p) ) !== json[p] ) {
							flag = false;
						};
					};
					
					if( flag) {
						clearInterval( node.timer );
					};
				},30);
				break;
				/////////////////////////////////////
			case "number" : 
				var startTime = new Date().getTime();
				node.timer = setInterval(function() {
					var initVal = "",
						speed = "",
						flag = true,
						opacity = "";
					//遍历属性
					for(var p in json) {
						initVal = parseInt( f(node).css(p) );
						speed = (json[p] - initVal)*( (new Date().getTime()-startTime)/1000/time );
						if( p === "opacity" ) {
							node.style["opacity"] = (speed*100 + initVal*100)/100;
						}else{
							 node.style[p] = ( speed + initVal ) + "px";
						}
					  if(  parseFloat( f(node).css(p) ) !== json[p] ) {
							flag = false;
						};
					};
					
					if( flag) {
						clearInterval( node.timer );
					};
				},30);
		};
	}
});

//classFactor;

/*
简单的工厂方法;
var F = f.factor(function(){
	this.init = function() {
		alert( "init" );
	};
	this.run1 = function() {
		alert("run2")
	};
});
F.extend({run3: function(){console.log("run3")}});
*/
f.extend(true,f,{
	//依赖f.extend;
	factor : function( defined ) {
		var noop = function() {};
		var isFn = function(f) {
			return typeof f==="function";
		};
		
		var isObj = function(o) {
			return typeof o==="object";
		};
		
		var C = function() {
			this.init&&this.init.apply(this, arguments)
		};
		C.extend = function( obj ) {
			if( isFn( obj ) ) {
				noop.prototype = obj
				return f.extend(C.prototype, new noop);
			};
			if( isObj( obj ) ) {
				return f.extend(C.prototype, obj);
			};
		};
		
		if( isFn( defined ) ) {
			defined.call(C.prototype, C.prototype);
		};
		if( isObj( defined ) ) {
			f.extend(C.prototype, defined);
		};
		
		return C;
	}
});

//延迟对象
f.extend(true,f,{
	Deferred : (function() {
		var Deferred = function() {
			//-1未触发, 0触发成功, 1 触发失败;
			this.state = -1;
			//保存成功或者失败的返回值;
			this.result = "";
			//这个保存执行的队列;
			this.chain = [];
		};
		Deferred.prototype = {
			constructor : Deferred,
			then : function(cb1, cb2) {
				this.chain.push( [cb1, cb2] );
				return this;
			},
			successCallback : function( fn ) {
				this.chain.push( [fn, null] );
				return this;
			},
			failCallback : function( fn ) {
				this.chain.push( [null ,fn] );
				return this;
			},
			check : function( res ) {
				//typeof res
			},
			fire : function( res ) {
				//初始化传进来的参数到对象;
				this.state = res instanceof Error ? 1 : 0;
				this.result = res;
				
				//这个是初始化该方法的初始对象;
				//如果返回的是延迟对象就把stop变成true;
				var stop = false;
				//这个延迟对象 作为 返回的延迟对象 的 回调;
				var cb;
				//执行的返回值
				var result;
				var fn;
				var state;
				var _this = this;
				
				while( fn = this.chain.shift() ) {
					fn = fn[ this.state ];
					
					result = this.result;
					if(typeof fn!=="function")continue;
					try{
						result = fn( result );
					}catch(e) {
						//给他一个错误的对象;
						result = e;
					};
					//如果返回的是延迟对象的话
					if( result instanceof Deferred ) {
						cb = function( res ) {
							_this.fire( res );
						};
						result.then( cb, cb );
						return;
					};
					//执行出错的话
					if( result instanceof Error ) {
						this.state = 1;
					}else{
						this.state = 0;
					};
					this.result = result;
				};
			},
			fireSuccess : function( res ) {
				this.result = [res, null];
			},
			fireFail : function( res ) {
				this.result = [null, res];
			}
		};
		
		return Deferred;
	})()
});

/*
var df2 = new f.Deferred().then(function(){
	var _this = this;
	l("def_innner");
	setTimeout("df3.fire()",3000);
},function (){});

setTimeout("df2.fire()",1000)


var df3 = new f.Deferred().then(function(){
	var _this = this;
	l("df33");
},function (){});

var df = new f.Deferred();
df.then(function(){l("run succ ,return deferred"); return df2},function(){l("fail")})
.then(function(){l("succ1"); return df3},function(){l("fail1")})
.then(function(){l("succ2")},function(){l("fail2")});

df.fire();
*/

//util工具方法
f.extend(true, f,{
	//
	contains : function(obj, target) {
		if( f.isArray( obj ) ) {
			return !!obj.indexOf(target);
		}else{
			
		}
	},
	/*	
	function test1(a, b) {
		console.log(a);
		l(b)
	};
	*/
	//f.invoke(test1,1,2)()
	invoke : function(fn) {
		var args = Array.prototype.slice.call( arguments );
		if(typeof args[0] === "function") {
			args = args.slice( 1 );
			return function() {
				fn.apply(null, args);
			};
		};
	},
	pluck : function( obj ) {
		var aResult = [];
		f.each( obj , function(k, v) {
			aResult.push( k );
		});
		return aResult;
	},
	"min" : function() {
		//return Math.min(arguments);这个返回的一直是NaN;
		return Math.min.apply(Math,arguments);
	},
	"max" : function() {
		//return Math.man(arguments);这个返回的一直是NaN,不能传伪数组.如果要传伪数组就要用劫持作用域用apply;
		return Math.max.apply(Math,arguments);
	},
	//理解为重新排序
	shuffer : function( arr ) {
		var len = arr.length;
		var tmp;
		var r, r2;
		f.each(arr,function() {
			r = Math.floor( len*Math.random() );
			r2 = Math.floor( len*Math.random() )
			tmp = arr[ r ];
			arr[r] = arr[r2];
			arr[r2] = tmp;
		});
		return arr;
	},
	size : function( obj ) {
		if( f.isArray(obj) ) return obj.length;
		if( f.isObject(obj) ) return f.pluck( obj ).length; 
	},
	flaten : function( arr ) {
		var result = [];
		f.each( arr ,function( a ) {
			if( f.isArray(a) ){
				result = result.concat( f.flaten( a ) );
			}else{
				result = result.concat( a );
			}
		});
		return result.concat([]);
	},
	unique : function( arr ) {
		var result = [];
		f.each(arr, function(a , index) {
			if(arr.indexOf( a ) === index ) {
				result.push( a );
			}
		});
		return result;
	},
	filter : function( arr, iterator ,context) {
		var result = [];
		f.each(arr, function( a, index) {
			if( iterator.call(context, a ,index) ) {
				result.push( a );
			}
		});
		return result;
	},
	intersection : function(arr) {
		var result = []
		var arr2 = (Array.prototype.slice.call(arguments,1)).shift();
		return f.filter(arr.concat([]), function(a){
			return arr2.indexOf( a ) !== -1;
		});
	},
	every : function(obj, iterator ,context) {
		var flag = true;
		f.each(obj, function(e) {
			if( !iterator(e) )flag=false;
		});
		return flag;
	},
	same : function(obj, iterator ,context) {
		var flag = false;
		f.each(obj, function(e) {
			if( iterator(e) )flag=true;
		});
		return flag;
	},
	compact : function( arr ) {
		return f.filter(arr, function( a ) {
			return a;
		});
	},
	object : function(list ,value) {
		var result = {};
		for(var i=0, len = list.length; i<len; i++) {
			if( value ) {
				result[ list[i] ] = value[i]; 
			}else{
				result[i] = list[i];
			};
		};
		return result;
	},
	bindAll : function(obj) {
		var funcs = Array.prototype.slice.call( arguments, 1 );
		f.each( funs, function(fn) {
			f.proxy(obj,funs);
		} );
	},
	delay : function(func, wait) {
		var args = Array.prototype.slice.call( arguments, 2 );
		return setTimeout(f.proxy(func, args) ,wait);
	},
	throttle : function(func ,wait) {
		var args = "";
		var previous;
		var now;
		return function() {
			now = new Date();
			args = arguments;
			if(!previous || (now - previous)>wait) {
				func.apply(null,args);
				previous = new Date();
			}else{
				return "no trigger"
			}
		};
	},
	once : function(func) {
		var ran = false;
		var arg = Array.prototype.slice.call(arguments);
		var memo;
		return function() {
			if( ran )return memo;
			ran = true;
			memo = func.apply(null,arg.concat( arguments ));
			return memo;
		};
	},
	compose : function() {
		var funcs = Array.prototype.slice.call( arguments );
		return function() {
			var args = Array.prototype.slice.call( arguments );
			for(var i=0, len = funcs.length; i<len; i++) {
				args[i] = funcs[i].apply(null, arguments);
			};
			return args;
		};
	},
	keys : function( obj ) {
		var result = [];
		//注意，这个会把原型上面的属性显示出来;
		for(p in obj){ result.push(p) };
		return result;
	},
	defaults : function(obj) {
		var args = Array.prototype.slice.call(arguments, 1);
		f.each(args, function(source) {
			if(source) {
				for(var prop in source) {
					if(obj[prop] === void 0)
						obj[prop] = source[prop]
				};
			};
		});
		return obj;
	},
	isElement : function( obj ) {
		return !!( obj && obj.nodeType === 1 )
	},
	isObject : function(obj) {
		// Object(1) ==> Number{};
		// Object("s22d") ==>{0:s,1:2,3:2,4:d };
		// Object(null) ==> Object {};
		// Object(NaN) ==> Number{};
		// Obect(false) ==> Boolean{};
		return obj === Object(obj);
	},
	"isNaN" : function( obj ){
		//NaN是唯一typeof为数字，但是却不等于自己的数字;
		if( typeof obj === "number" && obj !== obj){
			return true;
		};
		return false;
	},
	has : function(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	},
	//够无聊吧,哈哈 ==> f.times(100,function(a){return {a:a}});
	times : function(n ,iterator, context) {
		n = n || 0;
		var accum = Array( Math.max(0, n) );
		for(var i=0; i<n ;i++) {
			accum[i] = iterator.call(context, i)
		};
		return accum;
	},
	getOffset : function( obj ) {
		var parent = obj;
		var x = 0, y = 0;
		while( parent ) {
			x += parent.offsetLeft;
			y += parent.offsetTop;
			parent = parent.offsetParent;
		};
		return {
			x : x,
			y : y
		}
	},
	"docClient" : function() {
		return { 
			width : Math.max(document.documentElement.clientWidth,document.body.clientWidth) ,
			height : Math.max(document.documentElement.clientHeight,document.body.clientHeight)
		};
	},
	"docSroll" : function() {
		return {
			width : Math.max(document.documentElement.scrollWidth , document.body.scrollWidth),
			height : Math.max(document.documentElement.scrollHeight , document.body.scrollHeight)
		}
	}
});
setTimeout("console.clear()",1);
//JSON.Parse方法，这个方法不靠谱;
f.extend(true,f,{
	parseJSON : function(str) {
		var result = {};
		if( typeof str === "object" ) {
			return result = str;
		};
		
		try{
			result = eval( "(" +str+ ")" );
		}catch(e){
			result = e;
		};
		
		return result;
	},
	serialize : function( obj ) {
		if(! typeof obj === "object")return ;
		var str = "";
		for(var p in obj) {
			if( obj.hasOwnProperty( p ) ){
				if(!str)str += (encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				str += ("&" + encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			};
		};
		return str;
	},
	getObjForForm : function( el ) {
		
	}
});

//ajax
f.extend(true,f,{
	ajax : function( obj ) {
		if( !this._GetHttpRequest ) {
			this._GetHttpRequest = (function() {
				var Xhr;
				if( window.XMLHttpRequest ) {
					Xhr = window.XMLHttpRequest;
				}else{
					Xhr = window.ActiveXObject( "Microsoft.XMLHTTP" );
				};
				return Xhr;
			})();
		};
		if(typeof obj !== "object") {
			return;
		};
		var setting = {
			method : obj.method || "get",
			url : obj.url,
			data : obj.obj,
			cache : obj.cahce || true,
			onSuceess : obj.onSuccess || function() {},
			onFail : obj.onFail || function() {},
			header : obj.header || {},
			cache : obj.cache || false,
			sync : obj.sync || true,
			type : obj.type || "text"
		};
		f.extend(setting, obj);
		
		var xhr = new this._GetHttpRequest;
		if( setting.method.toLowerCase() === "get" && typeof setting.data === "object") {
			setting.data = f.serialize( setting.data );
		};

		if( setting.header ) {
			for(var header in setting.header) {
				if( setting.header.hasOwnProperty( header ) ) {
					xhr.setRequestHeader( header , setting.header[header] );
				};
			};
		};
		if( setting.cahce ) {
			setting.url += "?"+Math.random();
		};
		
		xhr.open( setting.method, ( setting.method === "get" ? setting.url  : setting.url +"?"+ f.serialize(setting.data))   , setting.sync );
		xhr.onreadystatechange = function() {
			if( xhr.readyState === 4 ) {
				switch( setting.type) {
					case "object" : 
						setting.onSuccess( f.parseJSON( xhr.responseText ) );
						break;
					case "xml" : 
						setting.onSuccess( xhr.responseXML );
						break;
					case "text" :
					default :
						setting.onSuceess( xhr.responseText );
					break;
				};
			};
		};
		xhr.onerror && (xhr.onerror = function() {
			setting.fail( xhr );
		})
		if(setting.method === "get")
			xhr.send();
		else{
			xhr.send( setting.data );
		};
		
		//\\//\\//\\//\\//\\//\\;
		return xhr;
	},
	get : function( obj ) {
		var setting = {
			url : obj.url,
			data : obj.obj,
			cache : obj.cahce || true,
			onSuceess : obj.onSuccess || function() {},
			onFail : obj.onFail || function() {},
			header : obj.header || {},
			cache : obj.cache || false,
			sync : obj.sync || true,
			type : obj.type || "text"
		};
		this.ajax( f.extend(setting, obj) );
	},
	post : function() {
		var setting = {
			method : "post",
			url : obj.url,
			data : obj.obj,
			cache : obj.cahce || true,
			onSuceess : obj.onSuccess || function() {},
			onFail : obj.onFail || function() {},
			header : obj.header || {},
			cache : obj.cache || false,
			sync : obj.sync || true,
			type : obj.type || "text"
		};
		this.ajax( f.extend(setting, obj) );
	},
	jsonp : function(url, data , callbackName) {
		if(typeof callbackName === "undefined") {
			callback = data;
			data = "";
		};
		var scr = document.createElement("script");
		scr.src = url + "?" + f.serialize(data) + "&callback=" + callbackName;
		document.body.append( scr );
	},
	loadCss : function( url ) {
		f("head").append(f.prototype.CE("link" ,{href:url ,rel:"stylesheet",type:"text\/css"}) );
	}
});

/*
f.subscribe("ev1",function(a,b,c){console.log(a),console.log(b)});

f.subscribe("ev1",function(a,b,c,d,e){console.log(a),l(b),l(c),l(d)},3,4);

f.subscribe("ev1",function(a){console.log(a)});

f.publish("ev1","1,2",2);
*/
//publish,subscribe
f.extend(true,f,{
	publish : function( obj ) {
		var args = Array.prototype.slice.call(arguments, 1);
		var subList = this._subList = this._subList || {};
		for(var i=0, len = subList[obj].length, subListFns = subList[obj]; i<len; i++) {
			if(typeof subListFns[i] === "function") {
				subListFns[i].apply(null, args);
			};
		};
		return this;
	},
	subscribe : function( obj, fn ) {
		var subList = this._subList = this._subList || {};
		var fns = subList[obj] = subList[obj] || [];
		var args = Array.prototype.slice.call(arguments, 2);
		var _fn = fn;
		var fn = function() {
			var innnerArg = Array.prototype.slice.call(arguments, 0);
			args = innnerArg.concat( args );
			return _fn.apply(null, args);
		};
		
		fns.push( fn );
		
		return fns.length-1;
	},
	deleteSubscribe : function( obj , fn) {
		if( typeof obj === "string" && (typeof fn === "number" || typeof fn === "function")) {
			var subList = this._subList = this._subList || {};
			var index = 0;
			if( typeof fn === "number" ) {
				index = fn;
				subList[obj].splice(fn, 1 );
			}else{
				index = subList[obj].indexOf(fn);
				subList[obj].splice(index, 1 );
			};
			
			return index;
		};
		if( typeof obj === "string" ) {
			var subList = this._subList = this._subList || {};
			subList[obj] = [];
		};
	}
});

/*
data = {
	name : "qihao",
	age : "26"
};
var tpl = "myname is <% name %> , age is : <% age %>";
f.format(tpl, data);
*/
f.extend(true,f,{
	//简单的模版引擎
	format : function(tpl, data) {
		var rTpl = /<%([^%>]+)%>/gi;
		return tpl.replace(rTpl, function(full,key) {
			return data[f.trim(key)]
		});
	},
	//比较高级的模版引擎;
	template : function(tpl, data) {
		var rTpl = /<%([^%>]+)%>/gi;
		var reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
		var strResult = "var arr = [];";
		var tmp = "";
		var index = 0;
		while( tmp = rTpl.exec(tpl) ) {
			//tmp = ["<% name %>", " name ", index: 10, input: "myname is <% name %> , age is : <% age %>"] 
			//l(tmp);
			strResult += (';arr.push( "' + tpl.substring(index,tmp.index).replace(/[\"\']/g,function( $$$$ ) {
					return "\\"+$$$$;
				}) + '" );');
			//console.log( reExp.test(tmp[1]) );如果是js的语句;
			//这个要判断是否是js语句，先进行非js语句的执行
			//strResult += arr.push( "+" + tmp[1] + "+" );
			//strResult = "";
			//如果不是js的语句;
			if( !(tmp[1].match(reExp)) ) {
				strResult += (';arr.push( ""+' + tmp[1] + '+"" );' );
			}else{
				strResult += tmp[1];
			};
			index = tmp.index + tmp[0].length;
		};
		strResult += (';arr.push( "' + tpl.substring(index).replace(/[\"\']/g,function( $$$$ ) {
					return "\\"+$$$$;
				}) + '" );return arr.join("")');
		return new Function( strResult ).call(data);
	}
});

(function() {
	var Button = function() {
	};
	var Menu = function() {
	};
	var Progressbar = function() {
	};
	var Slide = function() {
	};
	var Spinner = function() {
	};
	var Tabs = function() {
	};
	var Tooltip = function() {
	};
	//这个是用作插件吧;
	var scrollPlugin = function() {
	};
	var loader = function(){
	}
	/*
	*new Dragable()
	*{ range : { top : 100 ,left: 200, x : 0 , y : 0} }
	*{ clientScreen : true }
	*/
	var Dragable = function( setting ) {
		/*
		if( !(this instanceof Dragable)) {
			return new Dragable( setting );
		};
		*/
		var defaults = {
			el : this || f(setting.el)
		};
		f.defaults(defaults ,setting);
		this.defaults = defaults;
		Dragable.prototype.init( defaults );
	};
	Dragable.prototype = {
		constructor : Dragable,
		init : function( defaults ) {
			this.setPosition( defaults.el );
			this.ev( defaults );
		},
		setPosition : function( el ) {
			var posStatus;
			if( (posStatus = el.css("position")) !== "relative" || posStatus !== "absolute" ) {
				var l = el.css("left");
				var t = el.css("top");
				var w = el.css("width");
				var h = el.css("height");
				
				el.css("position","absolute");
				
				el.css("top", t);
				el.css("height", h);
				el.css("left", l);
				el.css("width", w);
			};
		},
		ev : function(defaults) {
			var el = defaults.el;
			var dx , dy;
			dx = 0;
			dy = 0;
			
			var moveFn = function(ev) {
				var ev = ev || window.event;
				var x = ev.clientX - dx;
				var y = ev.clientY - dy;
				
				if( defaults.clientScreen ) {
					var xy = f.docClient();
					var range = {
						x : Math.max.apply(Math,[ xy.width-parseInt(f(el.el[0]).css("width")) - parseInt(f(el.el[0]).css("margin-left"))-parseInt(f(el.el[0]).css("margin-right")) ]),
						y : Math.max.apply(Math,[ xy.height-parseInt(f(el.el[0]).css("height")) - parseInt(f(el.el[0]).css("margin-top")) - parseInt(f(el.el[0]).css("margin-bottom"))]),
						top : 0,
						left : 0
					};
				};
				//如果是视区内 或者 在defaults有个range
				if( defaults.clientScreen || defaults.range ) {
					if( x>range.x ) {
						x  = range.x;
					};
					if( y>range.y ) {
						y  = range.y;
					};
					if( x<range.left ) {
						x = range.left
					};
					if( y<range.top ) {
						y = range.top;
					};
				};
				el.css("left", x);
				el.css("top", y);
			};
			
			el.bind("mousedown",function( ev ) {
				var ev = ev || window.event;
				var el = defaults.el;
				var offset = f.getOffset(el.el[0]);
				var x = ev.clientX - offset.x;
				var y = ev.clientY - offset.y;
				dx = x;
				dy = y;
				
				f(document).bind2("mousemove",moveFn,false);
				f(document).bind2("mouseup",function() {
					f(document).unbind2("mousemove",moveFn,false);
				});
			});
		}
	};
	var Resize = function(setting, context) {
		if(!(this instanceof Resize)) {
			return new Resize( setting, this );
		};
		if( !(context instanceof f) ) {
			context = f(context);
		};
		var eWrap = this.wrap( context );
		var defaults = {
			el : eWrap
		};
		f.defaults(defaults ,setting);
		this.defaults = defaults;
		this.init( defaults );
		this.resizeElement();
	};
	//继承拖拽;
	Resize.prototype = f.extend__proto__( Dragable.prototype );
	//设置constructor;
	Resize.prototype.constructor = Resize;
	f.extend(true, Resize, {
		getWrap : function() {
			return '\
			<div class="wrapSize">\
				<div class="l"></div>\
				<div class="r"></div>\
				<div class="b"></div>\
				<div class="t"></div>\
			</div>'
		} 
	});
	f.extend(true,Resize.prototype, {
		/*这部分就是给他添加一个包裹的层,保存原来的context的样式数据*/
		wrap : function( context ) {			
			var oldParent = context.parent();
			var oldWidth = parseInt( context.css("width") )+20;
			var oldHeight = parseInt( context.css("height") )+20;
			context.data( "width" , oldWidth )
				.data( "height" , oldHeight)
				.data("left" ,context.css("top"))
				.data("top", context.css("top"))
				.data("position",context.css("position"));
				
			context.css("left",10).css("top",10).css("position","absolute");
			var wrapDiv = f(f.prototype.CE("div"));
			wrapDiv.html( Resize.getWrap() );
			var eWrap = f( ".wrapSize",wrapDiv.first() );
			eWrap.append(context);
			eWrap.css("width", oldWidth );
			eWrap.css("height", oldHeight);
			oldParent.append( eWrap );
			
			return eWrap;
		},
		resizeElement : function() {
			this.left = f(".l",this.defaults.el.el[0]);
			this.top = f(".t",this.defaults.el.el[0]);
			this.right = f(".r",this.defaults.el.el[0]);
			this.bottom = f(".b",this.defaults.el.el[0]);
			var dx, dy;
			var els = [this.left, this.top, this.right, this.bottom];
			
			f.each(els, function(el) {				
				el.bind("mousedown",function( ev ) {
					var offset = f.getOffset(el.el[0]);
					var x = ev.clientX - offset.x;
					var y = ev.clientY - offset.y;
					dx = x;
					dy = y;
					f(document).bind2("mousemove",moveFn,false);
					f(document).bind2("mouseup",function() {
						f(document).unbind2("mousemove",moveFn,false);
					});
				});
			});
			var moveFn = function(ev) {
				var ev = ev || window.event;
				var el = f( ev.target || ev.srcElement );
				var parentXY = f.getOffset( el.paren().first() );
				var x = ev.clientX - dx - parentXY.x;
				var y = ev.clientY - dy - parentXY.y;
				
				el.css("left", x);
				el.css("top", y);
				ev.stopPropagation();
			};
		}
	});
	/*
	f(function() {		
		var a = f("body");
		a.Dialog();
	});
	*/
	var Dialog = function(setting) {
		if(!(this instanceof Dialog)) {
			return new Dialog( setting, this );
		};
		setting = setting || {};
		var defaults = {
			id: null,
			width: '200px;',
			height: '100px;',
			title : "title",
			content : "content",
			attach: null,
			trigger: 'click',
			preventDefault: false,
			getTitle: null,
			getContent: null,
			position: {
				x: 'center',
				y: 'center'
			},
			adjustPosition: false,
			adjustDistance: 5,
			reposition: false,
			pointer: false,
			fade: 180,
			animation: null,
			theme: 'Default',
			addClass: '',
			overlay: false,
			zIndex: 10000,
			delayOpen: 0,
			delayClose: 0,
			closeOnEsc: false,
			closeOnClick: false,
			closeOnMouseleave: false,
			closeButton: false,
			draggable: true,
			onInit: function() {},
			onCreated: function() {},
			onOpen: function() {},
			onClose: function() {},
			onConfirm : function() {},
			autoClose: 7000,
			color: null
		};
		f.extend(defaults ,setting)
		this.defaults = defaults;
		this.initDialog();
	};
	//Dialog.prototype = f.extend__proto__(Dragable.prototype);
	f.extend(Dialog.prototype, {
		contructor : Dialog,
		initDialog : function() {
			this.defaults.init&&this.defaults.init();
			this.overlay();
			this.createDialog();
			this.setPosition();
			this.defaults.onCreated&&this.defaults.onCreated();
			this.defaults.draggable&&this.draggable();
			this.dialogEvents();
		},
		createDialog : function() {
			var dialog = f(f.prototype.CE("div",{ class : "f-dialog-wrap" ,className : "f-dialog-wrap" ,style:"height:"+this.defaults.height+";width:"+this.defaults.width+";z-index:"+this.defaults.zIndex++})).html( this.data("dialogHtml", {title: this.defaults.title,content:this.defaults.content}) );
			f(document.body).append( dialog );
			this.dialog = dialog;
		},
		overlay : function() {
			var mask = f.prototype.CE("div",{class : "f-mask", className : "f-mask", style : "z-index:"+this.defaults.zIndex++ });
			f(document.body).append( f(mask) );
			this.mask = mask;
		},
		data : function( value ,attr ) {
			switch( value ) {
				case  "dialogHtml"  : 
					var tpl = '<div class="f-dialog-container">'+
					'<dl>'+
						'<dt><% this.title %><a href="###" class="close fr">X</a></dt>'+
						'<dd><% this.content %></dd>'+
					'</dl>'+
					'<div class="f-dialog-footer">' +
						'<span class="close">关闭</span><span class="ok">确认</span>'+
					'</div>' +
				'</div>';
				
				return 	f.template(tpl, attr);
			};
		},
		setPosition : function() {
			var client = f.docClient();
			this.dialog.css("left", (client.width-parseInt(this.dialog.css("width")))/2)
				.css("top",(client.height-parseInt(this.dialog.css("height")))/2);
		},
		draggable : function() {
			Dragable.call( this.dialog );
		},
		dialogEvents : function() {
			var _this = this;
			f.each( f(".close" , this.dialog.first()).el ,function(el ,index) {
				f(el).bind2("click", function(ev) {
					_this.dialog.remove();
					_this.mask.remove();
					_this.defaults.onClose();
				});
			});
			f.each( f(".ok" , this.dialog.first()).el ,function(el ,index) {
				f(el).bind2("click", function(ev) {
					_this.dialog.remove();
					_this.mask.remove();
					_this.defaults.onConfirm();
				});
			});
		}
	});
	/*
	setting ==> {
		tip : "错误",
		times : false, // 自动消失的时间
		position : "left", @param [left, top, right, bottom]
		distance : {
			x : 0,
			y : 0	
		} //调整距离的说， x轴和y轴的距离;
	}
	*/
	function Tip( setting ,el) {
		if(!(this instanceof Tip)) {
			return new Tip( setting ,this.el );
		};
		this.el = el;
		this.defaults = {
			tip : "错误",
			times : false,
			position : "left",
			distance : {
				x : 0,
				y : 0	
			}
		};
		f.extend( true, this.defaults , setting );
		this.initTip();
	};
	Tip.prototype = {
		contructor : Tip,
		initTip : function() {
			this.wrap = f( f.prototype.CE("div") );
			this.wrap.html( f.template( this.getContent(), this.defaults) );
			this.show();
			this.defaults.times&&this.timeout();
			this.defaults.position&&this.position();
		},
		getContent : function() {
			return '<div class="smallTip-body"> \
				<div class="samllTip-wraper"> \
					<div class="smallTip-arrow-left"></div> \
					<div class="smallTip-arrow-top"></div> \
					<div class="smallTip-arrow-right"></div> \
					<div class="smallTip-arrow-bottom"></div> \
					<div class="smallTip-inner blue"> \
						<div class="smallTip-content blue"> \
							<p class="blue"><% this.tip %></p> \
						</div> \
					</div> \
				</div> \
			</div>';
		},
		show : function() {
			var _this = this;	
			f(this.el[0]).addClass("samllTip-parent");
			this.div = f(".smallTip-body",this.wrap.el[0]);
			f(this.el[0]).append( this.div );
		},
		position : function() {
			var _this = this;
			var position = {
				"left" : "right",
				"right" : "left",
				"bottom" : "top",
				"top" : "bottom"
			};
			f(".smallTip-arrow-"+ position[ this.defaults.position ],this.div.el[0]).css("display","block");
			switch( this.defaults.position ) {
				case "left" :
					this.div.css( "top",parseInt( f(this.el[0]).css("height") )/-2 + this.defaults.distance.x);
					this.div.css("left",parseInt( -parseInt( f(this.div).css("width") )-6 + this.defaults.distance.y ));
				break;
				case "top" :
					this.div.css( "top",-parseInt( f(this.div).css("height") + this.defaults.distance.x ));
					this.div.css("left",parseInt( parseInt( f(this.el[0]).css("width") )/2 + this.defaults.distance.y  ));
				break;
				case "right" :
					this.div.css( "top",parseInt( f(this.el[0]).css("height") + this.defaults.distance.x )/-2);
					this.div.css("left",parseInt( parseInt( f(this.el[0]).css("width") )+10+ this.defaults.distance.y  ));
				break;
				case "bottom" :
					this.div.css("left", parseInt( parseInt( f(this.el[0]).css("width") )/2  + this.defaults.x));	
					this.div.css("bottom", -parseInt( f(this.div).css("height"))+ this.defaults.distance.y  );
				break;
			};
		},
		timeout : function() {
			var _this = this;
			setTimeout(function(){
				f(_this.div).remove();
			},2000);
		}
	};
	
	var Accordion = function(setting, el) {
		if(!(this instanceof Accordion)) {
			return new Accordion( setting ,this.el );
		};
		this.el = el;
		this.defaults = {
			"event" : "click",
			"singalHeight" : 100,
			"time" : 1,
		};
		setting = setting || {};
		this.h4 = f("h4",this.el[0]);
		this.div = f("div",this.el[0]);
		
		f.extend(true, this.defaults, setting);
		this.initAccordion();
	};
	Accordion.prototype = {
		contructor : Accordion,
		initAccordion : function() {
			this.initEV();
		},
		initEV : function() {
			var _this = this;
			f.each( _this.h4.el ,function(e,i){
				f(e).bind2(_this.defaults.event,function(ev){
					_this.hideAll();
					var div = f(ev.target || ev.srcElement).next();
					f.move(div,_this.defaults.time,{
						height : _this.defaults.singalHeight
					});
				},false);
			});
		},
		hideAll : function() {
			var _this = this;
			f.each( this.div.el ,function(e,i){
				f(e).css("height","0");
			});
		},
		setHeight : function( val ) {
			f(this.el[0]).css("height", val);
		},
		setWidth : function( val ) {
			f(this.el[0]).css("width", val);
		}
	};
	f.extend(true,f.prototype, {
		Dragable : Dragable,
		Resize : Resize,
		Dialog : Dialog,
		Tip : Tip,
		Accordion : Accordion,
		Button : Button,
		Menu : Menu,
		Progressbar : Progressbar,
		Slide : Slide,
		Spinner : Spinner,
		Tabs : Tabs,
		scrollPlugin : scrollPlugin,
		loader : loader
	});
})();
/*
var rTpl = /<%([^%>]+)%>/gi;
data = {
	name : "qihao",
	age : "26",
	profile : {
		hands : 2,
		eye : 2
	}
};
var tpl = "my name is <% this.name %> , age is : <% this.age %> , had <%this.profile.hands%> and <%this.profile.eye%>end";
//'my name is '+ this.name +' , age is : '+ this.age +' , had '+this.profile.hands+' and '+this.profile.eye+'end'
//f.template(tpl,data)//  ===> "my name is qihao , age is : 26 , had 2 and 2end"
//l(f.template(tpl,data));

var tpl = "my eye is three times biger then you <% for(var i=0; i<3; i++) {%> 111 <%}%> end";
var tpl = "my eye is three times biger then you "+
	"<% for(var i=0; i<3; i++) {%> "+
	"<% this.name %>"+
	"<% this.age %>"+
	"<% } %> end" +
	"<% this.profile.hands %>" +
	"<% if(this.profile.eye) {%>" +
	"<% this.profile.eye %> "+
	"<%}%>";
/*
var arr = [];
arr.push( "my eye is three times biger then you " );
 for(var i=0; i<3; i++) {
	 ;arr.push( " 111 " )
};
arr.push( " end" );
return arr.join("")
*/
/*
'my eye is three times biger then you '+ 
for(var i=0; i<3; i++) {
	+' 111 '+ 
} +' end'
var r = [];
r.push('My skills:'); 
for(var index in this.skills) {
	r.push('<a href="">');
	r.push(this.skills[index]);
	r.push('</a>');
};
r.join('');
/*
(function() {
	return "<p>Hello, my name is " + 
		this.name + 
		". I\'m " + 
		this.profile.age + 
		" years old.</p>";
}).call({name : "qihao", profile : {age : "2"}});
*/
/*
(new Function('return "<p>Hello, my name is " + this.name + ". I\'m " + this.profile.age + 	" years old.</p>"')).call({name : "qihao", profile : {age : "2"}});
*/
//new Function("return 'my eye is three times biger then you '+ for(var i=0; i<3; i++) {+' 111 '+ } +' end' " );
//'my eye is three times biger then you '+ for(var i=0; i<3; i++) {+' 111 '+ } +' end' 
//DOMReady
f.ready = (function( win , doc ) {
	
	f.runOnload = function() {
		for(var i=0, len = f.readyList.length, runList = f.readyList; i< len; i++) {
			runList[i]();
		};
		
		f.readyList = [];
		doc.removeEventListener&&doc.removeEventListener("DOMContentLoaded", f.runOnload, false);
		win.onload = "";
	};
	
	win.onload = function() {
		f.runOnload()
	};
	
	doc.onreadystatechange = function(ev) {
		if( doc.readyState === "complete" ){
			f.runOnload();
		}; 
	};
	
	doc.addEventListener&&doc.addEventListener("DOMContentLoaded", f.runOnload, false);
	
})(window, document);



function getHref( href ) {
	var aLink = CE("a", {href : href});
	return aLink.href;
};

//检测返回的json结构是否正确
function testJSON(json, struct) {
	if(!struct) {
		throw new Error("argument Error");
	};
	if( typeof json !== "object" ) {
		l("ajax的返回数据不是json");
		if( json.toString() === struct )return true;
		return false;
	};
	for(var prop in json) {
		//如果规定的结构下面没有这个属性，直接返回false；
		if( !struct[prop] ) {
			return false;
		};
		//如果这个属性是json
		if( typeof json[prop] === "object" ) {
			//深度对比;
			if( !arguments.callee( json[prop] , struct[prop]) )return false;
		}else{
			//如果这个有值不相等的;
			if( json[prop]!==struct[prop] ) {
				return false;
			};
		};
	};
	//所有的检测完毕就返回真;
	return true;
};

//新建命名空间;
function createNS(str,target) {
	if( typeof str !== "string" )throw new Error("参数错误哦");
	target = target || window;
	var ns = str.split(".");
	var first = ns[0];
	target[ first ] = target[ first ] || {};
	if( next = ns.shift() )
		arguments.callee(ns.join("."), target[first] );
};


/*placeholder_for_IE*/
function isPlaceholder(){
	var input = document.createElement('input');
	return 'placeholder' in input;
};

function placeHolderFn(){		
	if (!isPlaceholder()){
		$("input").each(
			function(){
				if($(this).val()=="" && $(this).attr("placeholder")!=""){
					$(this).val($(this).attr("placeholder"));
					$(this).focus(function(){
						if($(this).val()==$(this).attr("placeholder")) $(this).val("");
					});
					$(this).blur(function(){
						if($(this).val()=="") $(this).val($(this).attr("placeholder"));
					});
				}
		});
	};
};

function sortWith( arg ){
	return function(a,b){
		if( (a[arg] - b[arg]) <0 )return -1;
		if( (a[arg] - b[arg]) >0 )return 1;
	};
};

function focusToNextInput( inputs ){
	for(var i=0 , l = inputs.length; i<l ; i++){
		(function(i){				
			var ipt = inputs[i];
			$(ipt).bind("keyup",function(ev){	
				var nextIpt = null;
				if( ev.keyCode !== 13 )return;
				if( nextIpt = inputs[i+1] ){
					nextIpt.focus()
				};
			});
		})(i);
	};
};

function isChinese(temp) {  
	var re = /[^\u4e00-\u9fa5]/;  
	if(re.test(temp)) return false;  
	return true;  
};

function isPhoneNumber(temp) {
	if( temp.search( /^([0-9]{11})?$/  )== -1 ){
		return false;
	};
	return true
};

f(function(){
	//l( f("#div2") );
	//f.loadCss("style\\ui.css")
});
