app.controller("matcalcCtrl", ['$scope', '$timeout', '$filter', '$localStorage', 'Recipe',
	function($scope, $timeout, $filter, $localStorage, Recipe) {
		$scope.recipes = [];
		$scope.selectedRecipes = [];
		$scope.search = "";
		$scope.isSearching = false;
		
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
				icon : recipe.icon,
				have : 0
			};
			
			newRecipe.isCrystal = (recipe.category_name === "Crystal");
			
			if (recipe.craft_quantity)
				newRecipe.makes = recipe.craft_quantity;
			
			if (recipe.quantity)
				newRecipe.quantity = recipe.quantity;
			
			if (recipe.tree && recipe.tree.length)
				newRecipe.tree = recipe.tree.map(mapRecipe);
			
			if (recipe.synths) {
				for (key in recipe.synths) {
					newRecipe = [recipe.synths[key]].map(mapRecipe)[0];
					newRecipe.quantity = recipe.quantity;
					newRecipe.have = 0;
				}
			}
						
			return newRecipe;
		};
		
		$scope.init = function() {
			$scope.selectedRecipes = $localStorage.recipes || [];
		};
		
		$scope.doSearch = function() {
			$scope.isSearching = true;
			
			Recipe.search($scope.search)
				.then(
					(res) => { $scope.recipes = res.data.recipes.results.map(mapfunc); $scope.isSearching = false; },
					(res) => { $scope.isSearching = false; }
				);
		};
		
		$scope.delete = function(index) {
			$scope.selectedRecipes.splice(index, 1);
		};
		
		$scope.$watch('recipeSelection', (newVal, oldVal, scope) => {
			if (oldVal === newVal) return;
			
			Recipe.get(newVal.id)
				.then(
					(res) => { scope.selectedRecipes.push([res.data].map(mapRecipe)[0]); },
					(res) => {}
				);
		});
		
		$scope.$watch('selectedRecipes', (newVal, oldVal, scope) => {
			if (newVal)
				$localStorage.recipes = scope.selectedRecipes;
		}, true);
				
	}
])
.directive('mcRecipeTree', function() {
	return {
		scope: {
			recipe: '=recipe'
		},
		templateUrl: 'recipetree.html'
	};
});
