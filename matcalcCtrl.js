app.controller("matcalcCtrl", ['$scope', '$timeout', '$filter', 'Recipe',
	function($scope, $timeout, $filter, Recipe) {
		$scope.recipes = [];
		$scope.recipeSelection = {};
		$scope.recipe = {};
		
		var mapfunc = function(obj) {
			var newObj = {
				name : obj.name,
				id : obj.id,
				icon : obj.icon
			};
			return newObj;
		};
		
		var mapRecipe = function(recipe) {
			
			var newRecipe = {
				id : recipe.id,
				name : recipe.name,
				icon : recipe.icon
			};
			
			if (recipe.craft_quantity)
				newRecipe.makes = recipe.craft_quantity;
			
			if (recipe.quantity)
				newRecipe.quantity = recipe.quantity;
			
			if (recipe.tree && recipe.tree.length)
				newRecipe.tree = recipe.tree.map(mapRecipe);
			
			if (recipe.synths) {
				for (key in recipe.synths) {
					console.log(recipe.synths[key]);
					newRecipe = [recipe.synths[key]].map(mapRecipe)[0];
				}
			}
						
			return newRecipe;
		};
		
		$scope.init = function() {
			Recipe.getAll()
				.then(
					(res) => { 
						$scope.recipes = res.data.recipes.results.map(mapfunc);
					},
					(res) => {}
				);
		};
				
		$scope.getRecipe = function(recipe, callback) {
			if (!recipe.connect_craftable) return;
			
			for (key in recipe.synths) {
				console.log(key);
				Recipe.get(key)
					.then(
						(res) => { console.log(res.data); },
						(res) => {}
					);
			}
		};
				
		$scope.$watch('recipeSelection', (newVal, oldVal, scope) => {
			if (oldVal === newVal) return;
			
			Recipe.get(newVal.id)
				.then(
					(res) => { console.log(res.data); scope.recipe = [res.data].map(mapRecipe)[0]; },
					(res) => {}
				);
		});
	}
]);
