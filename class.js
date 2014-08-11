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
		result.push( arg[i] );
	};
	return result;
};
f.trim = function(str) {
	var reg = /^\s+|\s+$/gi;
	return str.replace(reg,"");
};
f.prototype = {
	i : function(str,context) {
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
				this.el = [ this.allClass( str.substring(1) ) ];
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
	class : function() {
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
