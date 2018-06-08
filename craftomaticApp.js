var app = angular.module('craftomatic', ['ngStorage']);

app.factory('API', ['$http', function($http) {
	
	var API = {};
	var urlBase = "https://api.xivdb.com/";
		
	API.search = function(searchString) {
		return $http({
				url: urlBase + "search",
				params: {
					"string" : searchString,
					"one" : "recipes"
				},
				method: "GET"});
	};
	
	API.getRecipe = function(id) {
		return $http({
				url: urlBase + "recipe/" + id,
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
