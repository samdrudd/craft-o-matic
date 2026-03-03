class RecipeSelectedRecipesListView {
    constructor(containerID) {
        this.container = $(containerID);
    }

    listRecipes(recipes) {
        this.container.empty();
        recipes.forEach(recipe => {
            this.addRecipe(recipe);
        });
    }

    addRecipe(recipe) {
        var ingredientList = "";
        recipe.ingredients.forEach((ingredient) => {
            ingredientList += `
                <li class="mb-2">
                    <span>
                        <img src="${ingredient.icon}" class="icon" width="40" height="40">
                        <span>
                            <input id="${ingredient.id}" type="number" class="quantity ml-1" value="${ingredient.have}" min="0" max="${ingredient.quantity}"> / <b>${ingredient.quantity}</b>
                        </span>
                        <span class="ml-1">${ingredient.name}</span>
                        <i class="fa fa-check" style="display: none;"></i>
                    </span>
                </li>
            `;
        });

        var recipeCard = `
            <div id="${recipe.domid}" data-recipeid="${recipe.id}" class="recipe col-12 col-sm-6 col-md-4 col-lg-3 px-2 mb-3">
                <div class="card">
                    <div class="card-header text-center">
                        <a href="#${recipe.id}" data-toggle="collapse"><img src="${recipe.icon}" class="header float-left" width="50" height="50"></a>
                        <h4 class="card-title">
                            ${recipe.name}
                        </h4>
                        <p class="card-text">${recipe.class_name} ${recipe.level }</p>
                        <a href="#" class="cancel" onclick="deleteRecipe(${recipe.domid})"><i class="fa fa-times fa-lg"></i></a>
                    </div>
                    <div id="${recipe.id}" class="card-body show collapse">
                        <div class="list">
                            <ul class="ingredientList">
                                ${ingredientList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.append(recipeCard);
    }

    removeRecipe(recipeId) {
        this.container.find(`#${recipeId}`).remove();
    }

    update(data) {
        var action = data.action;

        switch (action) {
            case "add":
                this.addRecipe(data.recipe);
                break;
            case "remove":
                this.removeRecipe(data.domid);
                break;
            case "list":
                this.listRecipes(data.recipes);
                break;
        }
    }
}