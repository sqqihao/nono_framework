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
	for(var index in arg) {
		if( type === "object" ) {
			if(fn)result.push( fn( index, arg[index] ) );
			if(!fn)result.push(arg[index]);
		}else if( type === "array"&&(Number(index)) === (Number(index)) ) {
			if(fn)result.push( fn( arg[index] ) );
			if(!fn)result.push(arg[index]);
		}
	};
	return result;
};
f.each = function( arg ,fn) {
	var type =  Object.prototype.toString.call(arg).slice(8,-1).toLowerCase();
	for(var index in arg) {
		if ( type === "array"&&(Number(index)) === (Number(index)) ) {
			fn( arg[index] );
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
f.readyList = [];
f.prototype = {
	i : function(str,context) {
		if(typeof str === "function") {
			f.readyList.push( str );
			return this;
		};
		if( str instanceof f ) {
			return str;
		};
		
		if( !context ) context = document;
		
		if(str.nodeType===1) {
			this.el = [str];
			return ;
		};
		if(str.indexOf("#")==0) {
			this.el = [ context.getElementById( str.substring(1) ) ];
		}else if(str.indexOf("\.")===0) {
			if( context.getElementsByClassName ) {
				//this.el = Array.prototype.concat.call( document.getElementsByClassName( str.substring(1) ) ,[]);
				this.el = f.toArray( context.getElementsByClassName( str.substring(1) ) );
			}else{
				var className = str.substring(1),
					result = [],
					regClass = new RegExp("\\b"+className+"\\b","gi");
				var allEl = context.getElementsByTagName("*");
				for(var i = 0, len = allEl.length; i < len ; i++) {
					var selectorEl = allEl[i];
					selectorEl.className.search(regClass) !== -1 && result.push( selectorEl );
				};
				this.el = f.toArray( result );
				//this.el = [ this.allClass( str.substring(1) ) ];
			}
		}else{
			this.el = f.toArray( context.getElementsByTagName(str) );
		};
	},
	size : function() {
		return this.el.length;
	},
	noop : function() {
		
	},
	map : function( fn ) {
		this.el = f.map(this.el, fn);
	},
	each : function( fn ) {
		var i = 0,
			len = this.el.length;
		for(; i<len; i++) {
			fn.apply(this.el[i], [i, this.el[i]]);
		};
		return this;
	},
	reverseEach : function() {
		var len = this.el.length;
		while( --len ) {
			fn.call(this.el[len], len, this.el[len])
		};
		return this;
	},
	first : function() {
		return this.el[0];
	},
	last : function() {
		return this.el[ this.size()-1 ];
	},
	eq : function(num) {
		if(num<0)num+=this.el.length;
		return this.el[num];
	},
	"class" : function() {
		console.log( this );
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
	
};

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
		var arg = Array.prototype.slice.call(arguments),
			temp = "";
			//传JSON或者字符串只会接受第一个cookie，我要看看是为什么;
		if(typeof arg[0] === "object" && typeof arg[1]=== "number") {
			for(var p in arg[0]) {
				temp += (p+"="+arg[0][p]+"; ");
			};
			document.cookie = (temp + "; expires=" + new Date(new Date().getTime()+(arg[1]*3600*1000)).toGMTString());
			return f.ck();
		};
		if(typeof arg[0] === "string" && typeof arg[1]=== "number") {
			document.cookie = (arg[0] + "; expires=" + new Date(new Date().getTime()+(arg[1]*3600*1000)).toGMTString());
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
		//设置;
		if( val ) {
			f.each(this.el,function(e){
				e.setAttribute(name, val);
			});
			return this;
		};
		
		//获取
		var arr = [];
		f.each(this.el,function(e){
			arr.push(e.getAttribute(name));
		});
		return arr.length === 1 ? arr[0] : arr;
	},
	
	attrs : function() {
		return this.first().nodeType === 1 && this.first().attributes;
	},
	
	removeAttr : function( name ) {
		if( name ){
			f.each(this.el, function(e) {
				e.removeAttribute( name );
			});
			return this;
		};
		
		//f.prototype.removeAttr.call(this)
	},

	//l( f("#div1").html(111111111) );
	html : function(str) {
		if(str) {
			f.each(this.el,function(e){
				e.innerHTML = str;
			});
			return this;
		};
		//获取第一个
		return this.first().innerHTML;
	},
	
	text : function() {
		
	}
});

//样式模块;
f.camelize = function( arg ) {
	return arg.replace(/(-\w)?/gi,function(a){ return a.split("-").pop().toUpperCase() })
};
f.extend(true,f.prototype,{
	css : function(key,val) {
		var el = this.first();
		var key = f.camelize(key);
		var result = "";
		if(!val) {
			//有问题
			//if( el.style[key] ) result = el.style[key];
			if( window.getComputedStyle ) result = window.getComputedStyle(el,false)[key];
			if( el.currentStyle ) result = el.currentStyle[key];
			//NaN or AUTO;
			if(result !== result || result === "auto" ){
				return 0;
			};
			return result;
		}else{
			if(typeof val === "number")val += "px";
			el.style[key] = val;
		};
		return this;
	}
});

//缓存模块
f.uuid = 0;
f.cache = {};

f.extend(true,f.prototype,{
	data : function( key, val ) {
		var el = this.el[0];
		el.uuid = el.uuid || ++f.uuid;
		var datas = f.cache[ el.uuid ] = f.cache[ el.uuid ] || {};
		if( val ) {
			datas["el"] = el;
			datas[key] = val;
			return this;
		}else{
			return datas[key];
		};
	},
	val : function( val ) {
		if( "value" in this.first() ){		
			if(val){
				this.first().value = val
			}else{
				return this.first().value;
			};
		};
	}
});
var i = f("#ipt1");
var div1 = f("#div1");
//DOM节点操作模块;
f.extend(true,f.prototype,{
	append : function( target ) {
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
	children : function() {
		var els = "";
		//children不标准，但是全兼容哦;
		if( els = this.first().children ){
			return els;
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
		f.each(this.el,function(e){
			var events = e.events = e.events || {};
			events[type] = events[type] || [];
			//如果刚开始有绑定事件的话就走这个
			if(  e["on"+type] !== f.prototype.trigger ) {
				events[0] = e["on"+type];
			};
			
			e["on"+type] = (function() {
				return function(ev) {
					f.prototype.trigger.call(e,ev,type);
				};
			})();
			
			events[type].push( fn );
		});
		return this;
	},
	
	trigger : function( ev, type ) {
		l(arguments);
		//走这边说明是手动触发的;
		if( typeof ev !== "object" ) {
			type = ev;
			ev = "";
			this.trigger.call(this.first() ,{} , type)
		};
		
		var events = this.events = this.events || {};
		events[type] = events[type] || [];
		for(var i=0, len = events[type].length, fns = events[type]; i<len; i++) {
			fns[i](ev);
		}; 
	},
	
	removeBind : function(type) {
		if(typeof type === "string") {
			f.each(this.el,function(e){
				var events = e.events = e.events || {};
				events[type] = events[type] || [];
				//直接清空事件的列表;
				events[type] = [];
			});
		};
		if(typeof type === "function") {
			f.each(this.el,function(e){
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
							l(speed);
							node.style["opacity"] = (speed*100 + initVal*100)/100;
						}else{
							 node.style[p] = ( speed + initVal ) + "px";
						}
					  if(  parseInt( f(node).css(p) ) !== json[p] ) {
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

//加载器,好难写;
f.extend(true,f.prototype,{
});

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
	}
});

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


function CE( tag ,attr ) {
	var el = document.createElement(tag);
	if(attr) {
		switch( typeof attr ) {
			case "object" : 
				for(var p in attr) {
					el.setAttribute( p , attr[p] );
					if( p === "style") {
						el.style = attr[p];
					};
					if( p === "class" ) {
						el.className = attr[p];
					};
				};
				
			break;
		};
	};
	return el;
};

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
	l( f("#div2") );
});