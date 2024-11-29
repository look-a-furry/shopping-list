document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the shopping list and their checked state from local storage
    var shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    var checkedItems = JSON.parse(localStorage.getItem("checkedItems")) || [];

    // Function to render the shopping list
    function renderShoppingList() {
        var shoppingListElement = document.getElementById("shoppingList");
        shoppingListElement.innerHTML = ""; // Clear previous content

        shoppingList.forEach(function(item, index) {
            var li = document.createElement("li");

            // Create a checkbox for the item
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = checkedItems[index] || false;
            checkbox.addEventListener("change", function() {
                toggleStrikeThrough(index, checkbox.checked);
            });

            // Create a span to hold the item text
            var span = document.createElement("span");
            span.textContent = item;
            if (checkbox.checked) {
                span.style.textDecoration = "line-through";
            }

            // Add edit and remove buttons
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

            // Append elements to the list item
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(editButton);
            li.appendChild(removeButton);

            // Append the list item to the list
            shoppingListElement.appendChild(li);
        });
    }

    // Function to toggle strikethrough on the item
    function toggleStrikeThrough(index, isChecked) {
        checkedItems[index] = isChecked;
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    }

    // Function to add an item to the shopping list
    window.addItem = function() {
        var inputField = document.getElementById("itemInput");
        var item = inputField.value.trim();
        
        if (item !== "") {
            shoppingList.push(item);
            checkedItems.push(false); // Add unchecked state for new item
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
            localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
            renderShoppingList();
            inputField.value = "";
        }
    };

    // Function to remove an item from the shopping list
    window.removeItem = function(index) {
        shoppingList.splice(index, 1);
        checkedItems.splice(index, 1); // Remove corresponding checked state
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        renderShoppingList();
    };

    // Function to open the edit dialog
    window.openEditDialog = function(index) {
        var editInput = document.getElementById("editInput");
        editInput.value = shoppingList[index];
        editDialog.style.display = "block";
        editDialog.dataset.targetIndex = index;
    };

    // Function to save the edited item
    window.saveEdit = function() {
        var editInput = document.getElementById("editInput");
        var index = editDialog.dataset.targetIndex;
        shoppingList[index] = editInput.value.trim();
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        renderShoppingList();
        closeEditDialog();
    };

    // Function to close the edit dialog
    window.closeEditDialog = function() {
        editDialog.style.display = "none";
    };

    // Function to clear the entire shopping list
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

    // Event listener for the "Enter" key on the input field
    document.getElementById("itemInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") { // Check if the "Enter" key was pressed
            addItem();
        }
    });

    // Render the shopping list on page load
    renderShoppingList();
});
