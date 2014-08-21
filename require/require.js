// JavaScript Document;
var modules = {},
	readyList = []
	require,
	define,
	checkDone,
	getId,
	loadFile,
	//RegWhiteSpace = new RegExp("\\b","gi")
	spliteByWhiteSpace = function(str) {
		return str.split(" ");
	},
	baseUrl = getId().substr(0, getId().lastIndexOf("\/")+1);
	
	
/*define主要的方法就是getId和define*/
function getId() {
	var sTags = document.getElementsByTagName("script");
	if( f.browers.browser === "msie" ) {
		var len = sTags.length,
			i = 0;
		for(; i<len; i++) {
			if(/complete|interactive/.test( sTags[i].readyState )) {
				return sTags[i].src;
				//return sTags[i].getAttribute("src",2);
			};
		};
	}else{
		//这个不行啊，我勒个去
		//return sTags[sTags.length-1].src;
		//在本地报的错误和在http访问报的错误是不同的;
		/*
		本地的错误信息为 ： 
			ReferenceError: a is not defined
			at getId (file:///C:/Users/duanyao/Desktop/work/class/require/require.js:46:13)
			at file:///C:/Users/duanyao/Desktop/work/class/require/require.js:13:12
		http访问报的错误为:
			ReferenceError: a is not defined
			at getId (http://192.168.0.63/class/require/require.js:32:13)
			at http://192.168.0.63/class/require/require.js:13:12
			
		如果你在控制台直接运行报的错误是不对的;
		*/
		
		try {
            a.b.c(); //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack;
		};
		if( stack ) {
			stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
		};
	};
};

function define(deps, fn) {
	if( typeof deps !== "object" ) {
		fn = deps;
		deps = [];
	};
	var url = getId();
	require(deps,fn,url);
};


function require(deps/*依赖*/, factory/*function*/,id) {
	//通过definde走的话会有id,id就是文件的绝对路径;
	if( !id ) {
		//id =  "requireFN" + setTimeout(1);
		//id = getId();
		id =   "requireFN" + setTimeout(1);
	};
	if( typeof deps === "string" ) {
		deps = spliteByWhiteSpace(deps);
	};
	if( typeof deps === "function") {
		factory = deps;
		deps = [];
	};
	//dm为加载完成的模块
	var dm = 0,
	//lm为在加载的模块
		lm = 0;
	for(var i=0 ,len = deps.length; i<len; i++) {
		//dep可以理解为就是绝对路径;
		//会加载文件并返回地址;
		var dep = deps[i] = loadModule( deps[i] );
		//依赖模块;
		lm++;
		//如果在module下存在这个模块，而且加载完毕;
		if( modules[ dep ] && modules[ dep ].state === 2 ) {
			//加载完毕;
			dm++;
		};
	};
	modules[id] = {
		id : id,
		deps : deps,
		args : [],
		factory : factory
	};
	
	if( lm === dm ) {
		loadFile( id );
	}else{
		readyList.push( id );
	};
	
	checkDone();
};

/*通过id加载modules的模块*/
function loadFile( id ) {
	var module = modules[id];
	module.args  = [];
	for(var i=0, len = module.deps.length; i<len ; i++) {
		var dep = module.deps[i];
		module.args.push( modules[dep].exports );
	};
	module.exports = module.factory.call(null, module.args);
};


function loadModule(name) {
	var realUrl = "";
	if( name.indexOf("file:")===0 || name.indexOf("http:")===0 ) {
		realUrl = name; 
	}else if( name&&name.charAt(0)!=="\." || name&&name.charAt(0)!=="\\" ) {
		realUrl = baseUrl + name;
	};
	var eSpt = document.createElement("script");
	eSpt.src=realUrl;
	eSpt.onload = function() {
		//删除已经加载的列表
		readyList.splice( readyList.indexOf(realUrl) ,1 );
		
		modules[realUrl] = modules[realUrl] || {};
		modules[realUrl].status = 2;
		//先不删除;
		//this.parentNode.removeChild( eSpt );
		checkDone();
	};
	document.body.appendChild( eSpt );
	return realUrl;
};

function loadModule(name) {
	var realUrl = "";
	if( name.indexOf("file:")===0 || name.indexOf("http:")===0 ) {
		realUrl = name; 
	}else if( name&&name.charAt(0)!=="\." || name&&name.charAt(0)!=="\\" ) {
		realUrl = baseUrl + name;
	};
	var eSpt = document.createElement("script");
	eSpt.src=realUrl;
	//这个onload给shim用的,因为不按AMD走的话是变成全局变量的;
	eSpt.onload = function() {
		
	};
	document.body.appendChild( eSpt );
	return realUrl;
};

function checkDone() {
	label : for(var i=0 ; i < readyList.length; i++) {
		var m = readyList[i];
		var deps = modules[m].deps;
		var aArgs = [];
		var dep;
		
		//如果这个依赖还没加载好，就跳到另外一个执行;
		for(var j=0; j<deps.length; j++) {
			dep = deps[j];
			if ( !modules[dep] ) {
				continue label;
			};
		};
		
		//加载文件
		loadFile( m );
		//加载完毕后把这个删除
		readyList.splice(readyList.indexOf(m), 1);
	};
};