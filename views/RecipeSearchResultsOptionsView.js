class RecipeSearchResultsOptionsView {
    constructor(containerID) {
        this.container = $(containerID);
    }

    update(searchResults) {
        this.container.empty();
        this.container.append($("<option disabled selected value>Choose a recipe!</option>"));
        searchResults.forEach(result => {
            var option = $("<option></option>");
            option.val(result.id);
            option.text(result.name + " (" + result.class_name + ")");
            this.container.append(option);
        });
    }
}