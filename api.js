const API = {
    URL: "https://v2.xivapi.com/api/",
    search: search,
    getRecipeById: getRecipeById,
    mapRecipe: mapRecipe,
    mapBasic: mapBasic
};

function mapBasic(recipe) {
    var basicRecipe = {
        name : recipe.fields.ItemResult.fields.Name,
        class_name : recipe.fields.CraftType.fields.Name || '',
        id : recipe.row_id,
    };
    return basicRecipe;
};

function mapRecipe(recipe) {                   
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
                id: curRawIngredient.row_id,
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

function search(searchString, successCallback = null, errorCallback = null) {
    $.ajax({
        url: API.URL + "search",
        method: "GET",
        context: this,
        data: {
            "query" : "ItemResult.Name~\"" + searchString + "\"",
            "sheets" : "Recipe",
            "fields" : "ID,ItemResult.Name,CraftType"
        },
        success: function(data) {
            var searchResults = data.results.map(this.mapBasic);
            if (successCallback) {
                successCallback(searchResults);
            }
        },
        error: function(data) {
            console.error("Error searching for recipes");
            if (errorCallback) {
                errorCallback(data);
            }
        }
    });
}

function getRecipeById(recipeId, successCallback = null, errorCallback = null) {
    $.ajax({
        url: API.URL + "sheet/Recipe/" + recipeId,
        method: "GET",
        context: this,
        success: function(data) {
            var newRecipe = this.mapRecipe(data);
            if (successCallback) {
                successCallback(newRecipe);
            }
        },
        error: function() {
            console.error("Error fetching recipe by ID");
            if (errorCallback) {
                errorCallback();
            }
        }
    });
}