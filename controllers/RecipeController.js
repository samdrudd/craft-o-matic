class RecipeController {
    constructor(model) {
        this.model = model;
    }

    search(query, callbacks = {}) {
        this.model.search(query, callbacks);
    }

    select(recipeId, callbacks = {}) {
        this.model.select(recipeId, callbacks);
    }

    remove(recipeId, callbacks = {}) {
        this.model.remove(recipeId, callbacks);
    }

    updateQuantity(recipeId, ingredientId, quantity, callbacks = {}) {
        this.model.updateQuantity(recipeId, ingredientId, quantity, callbacks);
    }
}