var app = angular.module('matcalc', []);

app.factory('Recipe', ['$http', function($http) {
	
	var Recipe = {};
	var urlBase = "https://api.xivdb.com/";
		
	Recipe.getAll = function() {
		return $http({
				url: urlBase + "search",
				params: {
					"one" : "recipes",
					"level|gt" : 325
				},
				method: "GET"});
	};
	
	Recipe.get = function(id) {
		return $http({
				url: urlBase + "recipe/" + id,
				method: "GET",
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	return Recipe;
}]);
