app.controller("craftomaticCtrl", ['$scope', '$timeout', '$filter', '$localStorage', 'API',
	function($scope, $timeout, $filter, $localStorage, API) {
		$scope.recipes = [];
		$scope.selectedRecipes = [];
		$scope.search = "";
		$scope.isSearching = false;
		$scope.collapseAll = false;
		
		var mapfunc = function(obj) {
			var newObj = {
				name : obj.Name,
				id : obj.ID,
			};
			return newObj;
		};
		
		var mapIngredients = function(ingredients) {
			
		};
				
		var mapRecipe = function(recipe) {
			console.log(recipe);
									
			var newRecipe = {
				id : recipe.ID,
				name : recipe.Name,
				icon : 'https://xivapi.com' + recipe.Icon,
				class_name : recipe.ClassJob.NameEnglish || '',
				level : recipe.RecipeLevelTable.ClassJobLevel || '',
				collapsed : false,
				have : 0,
				quantity: recipe.Quantity
			};
			
			var ingredients = {}
			
			// Loop through AmountIngredients
			for (var i = 0; i < 10; i++) {
				key = "AmountIngredient" + i;
				qty = recipe[key];
				if (qty > 0)
					ingredients[i] = qty;
			}
			
			newRecipe.ingredients = [];
			
			for (key in ingredients) {
				ingrObj = recipe["ItemIngredient" + key];
				
				// Don't bother including crystals
				if (ingrObj["ItemSearchCategory"]["Name"] == "Crystals")
					continue;
				
				ingr = {};
								
				ingredientRecipes = recipe["ItemIngredientRecipe" + key];
				if (ingredientRecipes != null) {
					ingredientRecipes[0]["Name"] = recipe["ItemIngredient" + key]["Name"];
					ingredientRecipes[0]["Icon"] = recipe["ItemIngredient" + key]["Icon"];
					ingredientRecipes[0]["Quantity"] = ingredients[key];
					ingr = mapRecipe(ingredientRecipes[0]);
				} else {
					ingr.name = recipe["ItemIngredient" + key]["Name"];
					ingr.icon = "https://xivapi.com" + recipe["ItemIngredient" + key]["Icon"];
					ingr.quantity = ingredients[key] * newRecipe.quantity;
					ingr.have = 0;
				}
				
				newRecipe.ingredients.push(ingr);
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
						$scope.recipes = res.data.Results.map(mapfunc);
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
