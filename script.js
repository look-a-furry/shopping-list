document.addEventListener("DOMContentLoaded", function() {
    var shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    var checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || [];

    function renderShoppingList() {
        var shoppingListElement = document.getElementById("shoppingList");
        shoppingListElement.innerHTML = "";

        shoppingList.forEach(function(item, index) {
            var li = document.createElement("li");

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = checkedItems[index] || false;
            checkbox.addEventListener("change", function() {
                toggleStrikeThrough(index, checkbox.checked);
            });

            var span = document.createElement("span");
            span.textContent = `${item.name} (x${item.quantity})`;
            if (checkbox.checked) {
                span.style.textDecoration = "line-through";
            }

            var increaseBtn = document.createElement("button");
            increaseBtn.textContent = "+";
            increaseBtn.onclick = function() {
                shoppingList[index].quantity++;
                saveAndRender();
            };

            var decreaseBtn = document.createElement("button");
            decreaseBtn.textContent = "-";
            decreaseBtn.onclick = function() {
                if (shoppingList[index].quantity > 1) {
                    shoppingList[index].quantity--;
                } else {
                    removeItem(index);
                    return;
                }
                saveAndRender();
            };

            var editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit";
            editButton.onclick = function() {
                openEditDialog(index);
            };

            var removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "remove";
            removeButton.onclick = function() {
                removeItem(index);
            };

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(increaseBtn);
            li.appendChild(decreaseBtn);
            li.appendChild(editButton);
            li.appendChild(removeButton);

            shoppingListElement.appendChild(li);
        });
    }

    function toggleStrikeThrough(index, isChecked) {
        checkedItems[index] = isChecked;
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    }

    window.addItem = function() {
        var inputField = document.getElementById("itemInput");
        var item = inputField.value.trim();
        
        if (item !== "") {
            const existingIndex = shoppingList.findIndex(i => i.name.toLowerCase() === item.toLowerCase());
            if (existingIndex !== -1) {
                shoppingList[existingIndex].quantity++;
            } else {
                shoppingList.push({ name: item, quantity: 1 });
                checkedItems.push(false);
            }
            saveAndRender();
            inputField.value = "";
        }
    };

    window.removeItem = function(index) {
        shoppingList.splice(index, 1);
        checkedItems.splice(index, 1);
        saveAndRender();
    };

    window.openEditDialog = function(index) {
        var editInput = document.getElementById("editInput");
        editInput.value = shoppingList[index].name;
        editDialog.style.display = "block";
        editDialog.dataset.targetIndex = index;
    };

    window.saveEdit = function() {
        var editInput = document.getElementById("editInput");
        var index = editDialog.dataset.targetIndex;
        shoppingList[index].name = editInput.value.trim();
        saveAndRender();
        closeEditDialog();
    };

    window.closeEditDialog = function() {
        editDialog.style.display = "none";
    };

    window.clearShoppingList = function() {
        shoppingList = [];
        checkedItems = [];
        saveAndRender();
    };

    window.exportCSV = function() {
        var csvContent = "data:text/csv;charset=utf-8,Item,Quantity,Checked\n";
        shoppingList.forEach((item, index) => {
            csvContent += `"${item.name}",${item.quantity},${checkedItems[index] ? "true" : "false"}\n`;
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shopping_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    window.importCSV = function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result.split("\n").slice(1); // Skip header
            shoppingList = [];
            checkedItems = [];

            content.forEach(row => {
                if (row.trim() !== "") {
                    var [item, quantity, checked] = row.split(",");
                    item = item.replace(/^"|"$/g, "");
                    quantity = parseInt(quantity) || 1;
                    shoppingList.push({ name: item, quantity: quantity });
                    checkedItems.push((checked || "").trim() === "true");
                }
            });

            saveAndRender();
        };

        reader.readAsText(file);
    };

    document.getElementById("importFile").addEventListener("change", importCSV);
    renderShoppingList();
});