class RecipeModel {
    constructor() {
        this.searchResults = [];
        this.selectedRecipes = JSON.parse(localStorage.getItem("selectedRecipes")) || [];
        this.selectedRecipeData = {};
        this.searchResultsObservers = [];
        this.selectedRecipesObservers = [];

        if (this.selectedRecipes.length > 0) {
            this.selectedRecipeData.action = "list";
            this.selectedRecipeData.recipes = this.selectedRecipes;
        }
    }

    addSearchResultsObserver(observer) {
        this.searchResultsObservers.push(observer);
    }

    addSelectedRecipeObserver(observer) {
        this.selectedRecipesObservers.push(observer);
    }

    notifySearchResultsObservers() {
        this.searchResultsObservers.forEach(observer => observer.update(this.searchResults));
    }

    notifySelectedRecipeObservers() {
        this.selectedRecipesObservers.forEach(observer => observer.update(this.selectedRecipeData));
    }

    removeSearchResultsObserver(observer) {
        this.searchResultsObservers = this.searchResultsObservers.filter(obs => obs !== observer);
    }

    removeSelectedRecipeObserver(observer) {
        this.selectedRecipesObservers = this.selectedRecipesObservers.filter(obs => obs !== observer);
    }

    updateLocalStorage() {
        localStorage.setItem("selectedRecipes", JSON.stringify(this.selectedRecipes));
    }

    mapBasic(recipe) {
        var basicRecipe = {
            name : recipe.fields.ItemResult.fields.Name,
            class_name : recipe.fields.CraftType.fields.Name || '',
            id : recipe.row_id,
        };
        return basicRecipe;
    };

    mapRecipe(recipe) {                   
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

    search(searchString, callbacks = {}) {
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
                this.searchResults = data.results.map(this.mapBasic);
                if (callbacks.success) {
                    callbacks.success(this.searchResults);
                }
            },
            error: function(data) {
                console.error("Error searching for recipes");
                if (callbacks.error) {
                    callbacks.error(data);
                }
            },
            complete: function() {
                this.notifySearchResultsObservers();
                if (callbacks.complete) {
                    callbacks.complete();
                }
            }
        });
    }

    select(recipeId, callbacks = {}) {
        $.ajax({
            url: API.URL + "sheet/Recipe/" + recipeId,
            method: "GET",
            context: this,
            data: {
                "fields" : "ItemResult,RecipeLevelTable,CraftType,AmountIngredient,AmountResult,Ingredient"
            },
            success: function(data) {
                var newRecipe = this.mapRecipe(data);
                var currentRecipeCount = this.selectedRecipes.length;

                newRecipe.domid = currentRecipeCount + 1;

                this.selectedRecipeData.recipe = newRecipe;
                this.selectedRecipeData.action = "add";

                this.selectedRecipes.push(newRecipe);
                
                this.notifySelectedRecipeObservers();
                this.updateLocalStorage();

                if (callbacks.success) {
                    callbacks.success(newRecipe);
                }
            },
            error: function(data) {
                console.error("Error fetching recipe by ID");
                if (callbacks.error) {
                    callbacks.error(data);
                }
            },
            complete: function() {
                if (callbacks.complete) {
                    callbacks.complete();
                }
            }
        });
    }

    remove(recipeId, callbacks = {}) {
        this.selectedRecipes = this.selectedRecipes.filter(recipe => recipe.domid !== recipeId);
        this.selectedRecipeData.domid = recipeId;
        this.selectedRecipeData.action = "remove";
        this.notifySelectedRecipeObservers();
        this.updateLocalStorage();

        if (callbacks.success) {
            callbacks.success();
        }
    }
}