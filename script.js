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
            span.textContent = item;
            if (checkbox.checked) {
                span.style.textDecoration = "line-through";
            }

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
            li.appendChild(editButton);
            li.appendChild(removeButton);

            shoppingListElement.appendChild(li);
        });
    }

    function toggleStrikeThrough(index, isChecked) {
        checkedItems[index] = isChecked;
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    }

    window.addItem = function() {
        var inputField = document.getElementById("itemInput");
        var item = inputField.value.trim();
        
        if (item !== "") {
            shoppingList.push(item);
            checkedItems.push(false);
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
            localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            renderShoppingList();
            inputField.value = "";
        }
    };

    window.removeItem = function(index) {
        shoppingList.splice(index, 1);
        checkedItems.splice(index, 1);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    };

    window.openEditDialog = function(index) {
        var editInput = document.getElementById("editInput");
        editInput.value = shoppingList[index];
        editDialog.style.display = "block";
        editDialog.dataset.targetIndex = index;
    };

    window.saveEdit = function() {
        var editInput = document.getElementById("editInput");
        var index = editDialog.dataset.targetIndex;
        shoppingList[index] = editInput.value.trim();
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        renderShoppingList();
        closeEditDialog();
    };

    window.closeEditDialog = function() {
        editDialog.style.display = "none";
    };

    window.clearShoppingList = function() {
        shoppingList = [];
        checkedItems = [];
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    };

    // Function to print the shopping list
    window.printShoppingList = function() {
        var shoppingListItems = Array.from(document.querySelectorAll("#shoppingList > li"));
        var printableContent = `
            <h1 style="font-family: 'Courier New', monospace;">Shopping List</h1>
            <form style="font-family: 'Courier New', monospace;">
        `;

        shoppingListItems.forEach(function(item) {
            var itemText = item.querySelector("span").innerText;
            var isChecked = item.querySelector("input[type='checkbox']").checked;
            printableContent += `
                <label>
                    <input type="checkbox" ${isChecked ? "checked" : ""}>
                    ${itemText}
                </label><br>
            `;
        });

        printableContent += "</form>";
        var printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Printable Shopping List</title>
                </head>
                <body style="font-family: 'Courier New', monospace;">
                    ${printableContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    // EXPORT CSV FUNCTION
    window.exportCSV = function() {
        var csvContent = "data:text/csv;charset=utf-8,Item,Checked\n";
        shoppingList.forEach((item, index) => {
            csvContent += `"${item}",${checkedItems[index] ? "true" : "false"}\n`;
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shopping_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // IMPORT CSV FUNCTION
    window.importCSV = function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result.split("\n").slice(1); // Skip header row
            shoppingList = [];
            checkedItems = [];

            content.forEach(row => {
                if (row.trim() !== "") {
                    var [item, checked] = row.split(",");
                    item = item.replace(/^"|"$/g, ""); // Remove quotes
                    shoppingList.push(item);
                    checkedItems.push(checked.trim() === "true");
                }
            });

            localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
            localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            renderShoppingList();
        };

        reader.readAsText(file);
    };

    // Add import button event listener
    document.getElementById("importFile").addEventListener("change", importCSV);

    renderShoppingList();
});
