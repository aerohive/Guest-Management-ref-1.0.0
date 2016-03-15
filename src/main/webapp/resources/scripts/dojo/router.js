define([
	"./router/RouterBase"
], function(RouterBase){

	// module:
	//		ah/util/dojocover/AHRouter

/*=====
return {
	// summary:
	//		A singleton-style instance of ah/util/dojocover/AHRouter/RouterBase. See that
	//		module for specifics.
	// example:
	//	|	router.register("/widgets/:id", function(evt){
	//	|		// If "/widgets/3" was matched,
	//	|		// evt.params.id === "3"
	//	|		xhr.get({
	//	|			url: "/some/path/" + evt.params.id,
	//	|			load: function(data){
	//	|				// ...
	//	|			}
	//	|		});
	//	|	});
};
=====*/

	return new RouterBase({});
});
