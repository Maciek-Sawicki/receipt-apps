let receiptItems = [];

async function loadFromServer() {
    try {
        const response = await fetch('http://localhost:3000/receiptItems');
        receiptItems = await response.json();
        renderReceipt();
    } catch (error) {
        console.error('Error loading data from server:', error);
    }
}

function renderReceipt() {
    const container = document.getElementById('receipt').getElementsByTagName('tbody')[0];
    container.innerHTML = ''; 
    let totalSum = 0;

    receiptItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;

        const row = document.createElement('tr');
        const cellNo = document.createElement('td');
        const cellName = document.createElement('td');
        const cellQuantity = document.createElement('td');
        const cellPrice = document.createElement('td');
        const cellSum = document.createElement('td');

        cellNo.textContent = index + 1;
        cellName.textContent = item.name;
        cellQuantity.textContent = item.quantity;
        cellPrice.textContent = item.price.toFixed(2);
        cellSum.textContent = itemTotal.toFixed(2);

        const cellEdit = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => openEditDialog(index);
        cellEdit.appendChild(editButton);

        const cellDelete = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => openDeleteDialog(index);
        cellDelete.appendChild(deleteButton);

        row.appendChild(cellNo);
        row.appendChild(cellName);
        row.appendChild(cellQuantity);
        row.appendChild(cellPrice);
        row.appendChild(cellSum);
        row.appendChild(cellEdit);
        row.appendChild(cellDelete);

        container.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    totalCell.colSpan = 7;
    totalCell.textContent = `Total: ${totalSum.toFixed(2)} PLN`;
    totalCell.classList.add('total');
    totalRow.appendChild(totalCell);

    container.appendChild(totalRow);
}

document.getElementById('addItemButton').onclick = () => {
    showItemDialog();
};

function showItemDialog() {
    const dialog = document.getElementById('itemDialog');
    const form = document.getElementById('itemForm');
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const quantityInput = document.getElementById('itemQuantity');

    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';

    form.onsubmit = async () => {
        const newItem = {
            name: nameInput.value,
            price: parseFloat(priceInput.value),
            quantity: parseInt(quantityInput.value),
        };

        try {
            const response = await fetch('http://localhost:3000/receiptItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
            if (response.ok) {
                loadFromServer();
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }

        dialog.close();
    };

    document.getElementById('cancelButton').onclick = () => {
        dialog.close();
    };

    dialog.showModal();
}


function openEditDialog(index) {
    const dialog = document.getElementById('editDialog');
    const form = document.getElementById('editForm');
    const nameInput = document.getElementById('editItemName');
    const priceInput = document.getElementById('editItemPrice');
    const quantityInput = document.getElementById('editItemQuantity');

    const item = receiptItems[index];
    nameInput.value = item.name;
    priceInput.value = item.price;
    quantityInput.value = item.quantity;

    form.onsubmit = async () => {
        item.name = nameInput.value;
        item.price = parseFloat(priceInput.value);
        item.quantity = parseInt(quantityInput.value);

        try {
            const response = await fetch(`http://localhost:3000/receiptItems/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            if (response.ok) {
                loadFromServer();
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }

        dialog.close();
    };

    document.getElementById('cancelEditButton').onclick = () => {
        dialog.close();
    };

    dialog.showModal();
}


function openDeleteDialog(index) {
    const dialog = document.getElementById('deleteDialog');
    const form = document.getElementById('deleteForm');
    const item = receiptItems[index];

    form.onsubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/receiptItems/${item.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadFromServer();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }

        dialog.close();
    };

    document.getElementById('cancelDeleteButton').onclick = () => {
        dialog.close();
    };

    dialog.showModal();
}

loadFromServer();