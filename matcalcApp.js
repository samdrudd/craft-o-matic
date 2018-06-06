var app = angular.module('matcalc', ['ngStorage']);

app.factory('Recipe', ['$http', function($http) {
	
	var Recipe = {};
	var urlBase = "https://api.xivdb.com/";
		
	Recipe.search = function(searchString) {
		return $http({
				url: urlBase + "search",
				params: {
					"string" : searchString,
					"one" : "recipes"
				},
				method: "GET"});
	};
	
	Recipe.get = function(id) {
		return $http({
				url: urlBase + "recipe/" + id,
				method: "GET",
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	Recipe.getItem = function(id) {
		return $http({
			url: urlBase + "item/" + id,
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	return Recipe;
}]);
