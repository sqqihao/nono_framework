// JavaScript Document
require("test.js test2.js",function( $1 , $2) {
	console.log( JSON.stringify( $1 ) );
	console.log( JSON.stringify( $2 ) );
});

require("modules\\m_test1.js modules\\m_test2.js", function($3, $4) {
	console.log( $3 );
	console.log( $4 );
});