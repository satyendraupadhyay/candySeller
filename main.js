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

    axios.post('https://crudcrud.com/api/903a6e94e6dc425fbed6a6e083a0de44/candy', candyDetails)
    .then(res => console.log(res))
    .catch(err => console.log(err))
    candyQuantities[candyDetails.candyname] = candyDetails.quantity;

    displaySavedData(candyDetails);
}

function displaySavedData(userDetails) {
    var listItem = document.createElement('li');
    var candyName = userDetails.candyname;
    listItem.textContent = `${userDetails.candyname} - ${userDetails.description} - ${userDetails.price} -  `;
    listItem.classList.add('p-2');

    var quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = userDetails.quantity;
    quantityDisplay.setAttribute('data-candy', candyName);
    listItem.appendChild(quantityDisplay);

    var btn1 = createBuyButton('Buy 1', candyName);
    var btn2 = createBuyButton('Buy 2', candyName);
    var btn3 = createBuyButton('Buy 3', candyName);

    candyList.appendChild(listItem);
    listItem.appendChild(btn1);
    listItem.appendChild(btn2);
    listItem.appendChild(btn3);


    
}

function createBuyButton(text, candyName) {
    var button = document.createElement('button');
    button.type = "button";
    button.textContent = text;
    button.className = 'btn btn-primary btn-sm mr-2';

    button.addEventListener('click', function () {
        decreaseQuantity(candyName, parseInt(text.split(' ')[1])); // Extract the number from button text

        axios.put('https://crudcrud.com/api/903a6e94e6dc425fbed6a6e083a0de44/candy')
         .then(res => console.log(res))
         .catch(err => console.log(err))
    });

    return button;
}

function decreaseQuantity(candyName, amount) {
    var listItem = findListItemByCandyName(candyName);
    if (listItem) {
        var quantityElement = listItem.querySelector(`[data-candy="${candyName}"]`);
        var currentQuantity = parseInt(quantityElement.textContent);

        if (currentQuantity >= amount) {
            var newQuantity = currentQuantity - amount;
            quantityElement.textContent = newQuantity;
            candyQuantities[candyName] = newQuantity;
        }
    }
}

function findListItemByCandyName(candyName) {
    var listItems = document.querySelectorAll('#candy-list li');
    for (var i = 0; i < listItems.length; i++) {
        var itemName = listItems[i].textContent.split(' - ')[0];
        if (itemName === candyName) {
            return listItems[i];
        }
    }
    return null;
}