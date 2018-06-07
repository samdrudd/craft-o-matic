app.controller("matcalcCtrl", ['$scope', '$timeout', '$filter', '$localStorage', 'Recipe',
	function($scope, $timeout, $filter, $localStorage, Recipe) {
		$scope.recipes = [];
		$scope.selectedRecipes = [];
		$scope.search = "";
		$scope.isSearching = false;
		$scope.collapseAll = false;
		
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
				class_name : recipe.class_name || '',
				level : recipe.level_view || 0,
				url : recipe.url_xivdb,
				collapsed : false,
				isCraftable : (recipe.connect_craftable > 0),
				isGatherable : (recipe.connect_gathering > 0),
				isDrop : (recipe.connect_enemy_drop > 0),
				canBuy : (recipe.connect_shop > 0),
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
			
			if (newRecipe.isCraftable && !newRecipe.tree) {
				Recipe.getItem(newRecipe.id).then(
					(res) => { 
						newRecipe.yields = res.data.craftable[0].craft_quantity;
						newRecipe.tree = res.data.craftable[0].tree.map(mapRecipe);
						
						// Account for recipes that create multiple items when calculating quantity
						var needed = Math.ceil(newRecipe.quantity / newRecipe.yields);
						
						for (var i = 0; i < newRecipe.tree.length; i++) {
							newRecipe.tree[i].quantity = newRecipe.tree[i].quantity * needed;
						}
					},
					(res) => {}
				);
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
					(res) => { 
						$scope.recipes = res.data.recipes.results.map(mapfunc);
						if ($scope.recipes.length === 1)
							$scope.recipeSelection = $scope.recipes[0]
						$scope.isSearching = false; 
					},
					(res) => { $scope.isSearching = false; }
				);
		};
		
		$scope.clearAll = function() {
			bootbox.confirm({
				title: "<i class='fa fa-exclamation-circle text-secondary'></i> Are you sure?",
				message: "This will <b>remove all selected recipes</b>. Click 'OK' to proceed.", 
				callback: (res) => {
					if (res) {
						$scope.selectedRecipes = [];
						$scope.$digest();
					}
				}
			});
		}
		
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
})
.directive('mcRecipe', function() {
	return {
		scope: {
			recipe: '=recipe'
		},
		templateUrl: 'recipe.html'
	};
});
