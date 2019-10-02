var app = angular.module('craftomatic', ['ngStorage']);

app.factory('API', ['$http', function($http) {
	
	var API = {};
	var urlBase = "https://xivapi.com/";
		
	API.search = function(searchString) {
		return $http({
				url: urlBase + "search",
				params: {
					"string" : searchString,
					"indexes" : "Recipe"
				},
				method: "GET"});
	};
	
	API.getRecipe = function(id) {
		return $http({
				url: urlBase + "Recipe/" + id,
				method: "GET",
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	API.getItem = function(id) {
		return $http({
			url: urlBase + "item/" + id,
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	return API;
}]);
