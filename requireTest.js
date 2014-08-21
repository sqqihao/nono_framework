

var modules = {},
	readyList = []
	req,
	def,
	checkDone,
	getId,
	loadFile,
	//RegWhiteSpace = new RegExp("\\b","gi")
	spliteByWhiteSpace = function(str) {
		return str.split(" ");
	},
	baseUrl = getId().substr(0, getId().lastIndexOf("\/")+1);
	
function req(deps/*依赖*/, factory/*function*/,id) {
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
	
	// load module;
	// done module;
	var dm = 0,
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
		}else{
			//保存这个地址;
			readyList.push( deps[i] );
		};
	};
	
	modules[id] = {
		id : id,
		args : [],
		deps : deps,
		factory : factory,
		exports : "",
		status : -1 //1未加载 // 2 加载完毕
	};
	
	if( dm===lm ) {
		loadFile(id);
	}else{
		readyList.push( id );
	};
	
};

//依赖这几个js文件;
req("test2.js http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js test.js http://libs.baidu.com/swfobject/2.2/swfobject.js http://libs.baidu.com/underscore/1.3.3/underscore.js",function(){
	console.log("load_backbone");
	//依赖文件加载完成, 就加载这个回调;
	req("http://libs.baidu.com/backbone/0.9.2/backbone.js ",function() {
		console.log("backbone is loaded, would load jquery from baidu CDN");
		req("http://libs.baidu.com/jquery/1.9.0/jquery.js",function() {
			console.log("jquery is loaded form CND!");
		});
	});
	return {
		key : 1,
		key2 : 2
	}
});

/*
req("",function() {
	
});
*/

function def(deps, fn) {
	if( typeof deps !== "object" ) {
		fn = deps;
		deps = [];
	};
	var url = getId();
	req(deps,fn,url);
};

function checkDone() {
	for(var m in readyList) {
		if( readyList.hasOwnProperty( m ) ) {
			m = readyList[m];
			var flag = true;
			if( modules[m] === undefined ) {
				flag = false;
			};
			
			for(var i=0, len = modules[m]&&modules[m].deps.length, deps = modules[m]&&modules[m].deps; i < len ; i++) {
				if( modules[ deps[i] ] !==2 ) {
					flag = false;
				};
			};
			if( flag ) {
				loadFile(m)
			};
		};
	};
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
		return sTags[sTags.length-1].src;
	};
};

function loadFile( id ) {
	var module = modules[id];
	module.exports = module.factory.call(null, module.args);
};