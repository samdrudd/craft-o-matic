app.controller("matcalcCtrl", ['$scope', '$timeout', '$filter', 'Recipe',
	function($scope, $timeout, $filter, Recipe) {
		$scope.recipes = [];
		$scope.recipeSelection = {};
		$scope.recipe = {};
		
		
		$scope.init = function() {
			Recipe.getAll()
				.then(
					(res) => { $scope.recipes = res.data.recipes.results; },
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
					(res) => { scope.recipe = res.data; },
					(res) => {}
				);
		});
	}
]);
