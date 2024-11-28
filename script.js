document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the shopping list from local storage on page load
    var shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

    // Function to render the shopping list
    function renderShoppingList() {
        var shoppingListElement = document.getElementById("shoppingList");
        shoppingListElement.innerHTML = ""; // Clear previous content

        shoppingList.forEach(function(item, index) {
            var li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${item.checked ? "checked" : ""} onclick="toggleItemChecked(this, ${index})">
                <span class="${item.checked ? "crossed" : ""}">${item.text}</span>
                <button onclick="openEditDialog(${index})" class="edit">Edit</button>
                <button onclick="removeItem(${index})" class="remove">Remove</button>
            `;
            shoppingListElement.appendChild(li);
        });
    }

    // Function to toggle the checked state of an item
    window.toggleItemChecked = function(checkbox, index) {
        // Update the 'checked' state in the shopping list array
        shoppingList[index].checked = checkbox.checked;

        // Update the class of the corresponding span element
        var listItem = checkbox.closest("li");
        var span = listItem.querySelector("span");
        if (checkbox.checked) {
            span.classList.add("crossed");
        } else {
            span.classList.remove("crossed");
        }

        // Save the updated state to local storage
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    };

    // Render the shopping list on page load
    renderShoppingList();

    // Function to add an item to the shopping list
    window.addItem = function() {
        var inputField = document.getElementById("itemInput");
        var itemText = inputField.value.trim();
    
        if (itemText !== "") {
            shoppingList.push({ text: itemText, checked: false });
            localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Save to local storage
            renderShoppingList();
            inputField.value = "";
        }
    };

    // Function to remove an item from the shopping list
    window.removeItem = function(index) {
        shoppingList.splice(index, 1);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Save to local storage
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
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Save to local storage
        renderShoppingList();
        closeEditDialog();
    };

    // Function to close the edit dialog
    window.closeEditDialog = function() {
        editDialog.style.display = "none";
    };

    function printShoppingList() {
        var shoppingList = document.getElementById("shoppingList").innerHTML;
        var printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Printable Shopping List</title></head><body>');
        printWindow.document.write('<h1>Shopping List</h1>');
        printWindow.document.write('<ul style="list-style-type: none;">' + shoppingList + '</ul>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Event listener for the Add button
    document.getElementById("itemInput").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) { // 'Enter' key pressed
            addItem();
        }
        
    });

    window.printShoppingList = function() {
        var shoppingListItems = Array.from(document.querySelectorAll("#shoppingList > li"));
        var printableContent = "<h1>Shopping List</h1><form style=\"font-family: monospace;\">";
    
        shoppingListItems.forEach(function(item) {
            var itemText = item.querySelector("span").innerText;
            printableContent += "<label><input type=\"checkbox\">" + itemText + "</label><br>";
        });
    
        printableContent += "</form>";
    
        var printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Printable Shopping List</title></head><body style=\"font-family: monospace; size: 15\"');
        printWindow.document.write('<br>');
        printWindow.document.write(printableContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    // Function to clear the entire shopping list
    window.clearShoppingList = function() {
        shoppingList = []; // Empty the shopping list array
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList)); // Update local storage
        renderShoppingList(); // Render the updated shopping list
    };

});
