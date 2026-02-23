var app = angular.module('craftomatic', ['ngStorage']);

app.factory('API', ['$http', function($http) {
	
	var API = {};
	var urlBase = "https://v2.xivapi.com/api/";
		
	API.search = function(searchString) {
		return $http({
				url: urlBase + "search",
				params: {
					"query" : "ItemResult.Name~\"" + searchString + "\"",
					"sheets" : "Recipe",
					"fields" : "ItemResult,CraftType"
				},
				method: "GET"});
	};
	
	API.getRecipe = function(id) {
		return $http({
				url: urlBase + "/sheet/Recipe/" + id,
				params: {
					"fields" : "ItemResult,RecipeLevelTable,CraftType,AmountIngredient,AmountResult,Ingredient"
				},
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
