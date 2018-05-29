app.controller("matcalcCtrl", ['$scope', '$timeout', '$filter', 'Recipe',
	function($scope, $timeout, $filter, Recipe) {
		$scope.recipes = [];
		$scope.recipe = {};
		
		
		$scope.init = function() {
			Recipe.getAll()
				.then(
					(res) => { $scope.recipes = res.data; },
					(res) => {}
				)
		};
	}
]);
