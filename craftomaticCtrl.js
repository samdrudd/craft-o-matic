app.controller("craftomaticCtrl", ['$scope', '$timeout', '$filter', '$localStorage', 'API',
	function($scope, $timeout, $filter, $localStorage, API) {
		$scope.recipes = [];
		$scope.selectedRecipes = [];
		$scope.search = "";
		$scope.isSearching = false;
		$scope.collapseAll = false;
		
		var mapBasic = function(recipe) {
			var basicRecipe = {
				name : recipe.fields.ItemResult.fields.Name,
				class_name : recipe.fields.CraftType.fields.Name || '',
				id : recipe.row_id,
			};
			return basicRecipe;
		};
						
		var mapRecipe = function(recipe) {
									
			var newRecipe = {
				id : recipe.row_id,
				name : recipe.fields.ItemResult.fields.Name,
				icon : "https://v2.xivapi.com/api/asset?path=" + recipe.fields.ItemResult.fields.Icon.path + "&format=jpg",
				class_name : recipe.fields.CraftType.fields.Name || '',
				level : recipe.fields.RecipeLevelTable.fields.ClassJobLevel || '',
				collapsed : false,
				have : 0,
				quantity: recipe.Quantity || 1,
				yields: recipe.AmountResult || 1,
				ingredients: []
			};
			
			var rawIngredientAmounts = recipe.fields.AmountIngredient || [];
			var rawIngredients = recipe.fields.Ingredient || [];
			
			for (var i = 0; i < rawIngredients.length; i++) {
				var curRawIngredient = rawIngredients[i];
				var curRawIngredientAmount = rawIngredientAmounts[i];
				
				if (curRawIngredientAmount > 0) {
					var newIngr = {
						name: curRawIngredient.fields.Name,
						icon: "https://v2.xivapi.com/api/asset?path=" + curRawIngredient.fields.Icon.path + "&format=jpg",
						have: 0,
						quantity: curRawIngredientAmount
					};
					newRecipe.ingredients.push(newIngr);
				}
			}

			return newRecipe;
		};
		
		$scope.init = function() {
			$scope.selectedRecipes = $localStorage.recipes || [];
		};
		
		$scope.doSearch = function() {
			$scope.isSearching = true;
			
			API.search($scope.search)
				.then(
					(res) => { 
						$scope.recipes = res.data.results.map(mapBasic);
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
			if (!newVal || !newVal.id) return;
					
			API.getRecipe(newVal.id)
				.then(
					(res) => {
						scope.selectedRecipes.push(mapRecipe(res.data));
						scope.recipeSelection = {};
						},
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
		templateUrl: './recipetree.html'
	};
})
.directive('mcRecipe', function() {
	return {
		scope: {
			recipe: '=recipe'
		},
		templateUrl: './recipe.html'
	};
});
