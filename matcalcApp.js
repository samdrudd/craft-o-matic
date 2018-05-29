var app = angular.module('matcalc', []);

app.factory('Recipe', ['$http', function($http) {
	
	var Recipe = {};
	var urlBase = "http://127.0.0.1:8000/";
		
	Recipe.getAll = function() {
		return $http({
				url: urlBase + "recipes",
				method: "GET"});
	};
	
	Recipe.add = function(recipe) {
		return $http({
				url: urlBase + "recipes",
				method: "POST",
				data: $.param(recipe),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	Recipe.edit = function(id, recipe) {
		return $http({
				url: urlBase + "recipes/" + id,
				method: "PUT",
				data: $.param(job),
				headers: { "Content-Type": "application/x-www-form-urlencoded"}});
	};
	
	Recipe.delete = function(id) {
		return $http({
				url: urlBase + "recipes/" + id,
				method: "DELETE" });
	};
	
	return Recipe;
}]);
