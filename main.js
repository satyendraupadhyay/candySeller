var form = document.getElementById('my-form');
var candyList = document.getElementById('candy-list');
var candyQuantities = {};

form.addEventListener('submit', getValue);

function getValue(e) {
    e.preventDefault();

    var getCandyName = document.getElementById('name');
    var getDescription = document.getElementById('des');
    var getPrice = document.getElementById('price');
    var getQuantity = document.getElementById('quantity');

    var candyDetails = {
        candyname: getCandyName.value,
        description: getDescription.value,
        price: getPrice.value,
        quantity: getQuantity.value
    }

    axios.post('https://crudcrud.com/api/b46cdf29eb8a4e60949027aa0ce78ea3/candy', candyDetails)
        .then(res => console.log(res))
        .catch(err => console.log(err))

    displaySavedData(candyDetails);
}

function displaySavedData(userDetails) {
    var listItem = document.createElement('li');
    var candyName = userDetails.candyname;
    listItem.textContent = `${userDetails.candyname} - ${userDetails.description} - ${userDetails.price} - `;
    listItem.classList.add('p-2');

    var quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = userDetails.quantity;
    quantityDisplay.setAttribute('data-candy-id', userDetails._id); // Use _id as the data attribute
    listItem.appendChild(quantityDisplay);

    var btn1 = createBuyButton('Buy 1', userDetails._id, userDetails);
    var btn2 = createBuyButton('Buy 2', userDetails._id, userDetails);
    var btn3 = createBuyButton('Buy 3', userDetails._id, userDetails);

    candyList.appendChild(listItem);
    listItem.appendChild(btn1);
    listItem.appendChild(btn2);
    listItem.appendChild(btn3);
}

function createBuyButton(text, candyId, userDetails) {
    var button = document.createElement('button');
    button.type = "button";
    button.textContent = text;
    button.className = 'btn btn-primary btn-sm mr-2';

    button.addEventListener('click', function () {
        var quantityToBuy = parseInt(text.split(' ')[1]);
        var updatedQuantity = decreaseQuantity(candyId, quantityToBuy);

        if (updatedQuantity !== undefined) {
            updateQuantityOnServer(candyId, updatedQuantity);
        }
    });

    return button;
}

function updateQuantityOnServer(candyId, updatedQuantity) {
    const updatedData = {
        quantity: updatedQuantity
    };

    axios.put(`https://crudcrud.com/api/b46cdf29eb8a4e60949027aa0ce78ea3/candy/${candyId}`, updatedData)
        .then(res => {
            console.log('Item Updated:', res.data);
            // Update the displayed quantity after successful update
            var quantityElement = document.querySelector(`[data-candy-id="${candyId}"]`);
            quantityElement.textContent = updatedQuantity;
        })
        .catch(err => {
            console.error('Error Updating item:', err);
        });
}

function decreaseQuantity(candyId, amount) {
    var listItem = findListItemByCandyId(candyId);
    if (listItem) {
        var quantityElement = listItem.querySelector(`[data-candy-id="${candyId}"]`);
        var currentQuantity = parseInt(quantityElement.textContent);

        if (currentQuantity >= amount) {
            var newQuantity = currentQuantity - amount;
            quantityElement.textContent = newQuantity;
            return newQuantity;
        }
    }
    // return currentQuantity;
}

function findListItemByCandyId(candyId) {
    var listItems = document.querySelectorAll('#candy-list li');
    for (var i = 0; i < listItems.length; i++) {
        var itemId = listItems[i].querySelector(`[data-candy-id="${candyId}"]`);
        if (itemId) {
            return listItems[i];
        }
    }
    return null;
}

// GET the saved User Details from crudcrud.
window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/b46cdf29eb8a4e60949027aa0ce78ea3/candy")
        .then(res => {
            for (var i = 0; i < res.data.length; i++) {
                displaySavedData(res.data[i])
            }
            console.log(res);
        })
        .catch(err => console.error(err));
})
