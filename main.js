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
    candyQuantities[candyDetails._id] = candyDetails.quantity;

    displaySavedData(candyDetails);
}

function displaySavedData(userDetails) {
    var listItem = document.createElement('li');
    var candyName = userDetails.candyname;
    listItem.textContent = `${userDetails.candyname} - ${userDetails.description} - ${userDetails.price} - `;
    listItem.classList.add('p-2');

    var quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = userDetails.quantity;
    quantityDisplay.setAttribute('data-candy', candyName);
    listItem.appendChild(quantityDisplay);

    var btn1 = createBuyButton('Buy 1', candyName, userDetails);
    var btn2 = createBuyButton('Buy 2', candyName, userDetails);
    var btn3 = createBuyButton('Buy 3', candyName, userDetails);
    
    // var del = document.createElement('button');
    // button.type = "button";
    // button.textContent = 'Delete';
    // button.className = 'btn btn-danger btn-sm mr-2';

    candyList.appendChild(listItem);
    listItem.appendChild(btn1);
    listItem.appendChild(btn2);
    listItem.appendChild(btn3);
    // listItem.appendChild(del);
    
}


function createBuyButton(text, candyName, userDetails) {
    var button = document.createElement('button');
    button.type = "button";
    button.textContent = text;
    button.className = 'btn btn-primary btn-sm mr-2';

    button.addEventListener('click', function () {
        var quantityToBuy = parseInt(text.split(' ')[1]);
        var updatedQuantity = decreaseQuantity(candyName, quantityToBuy);


        var itemId = userDetails._id;

        const updatedData = {
            name: userDetails.candyname,
            description: userDetails.description,
            price: userDetails.price,
            quantity: updatedQuantity
        };
    
        axios.put(`https://crudcrud.com/api/b46cdf29eb8a4e60949027aa0ce78ea3/candy/${itemId}`, updatedData)
            .then(res => {
                console.log('Item Updated:', res.data);
            })
            .catch(err => {
                console.error('Error Updating item:', err);
            });

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
            return newQuantity;
        }
    }
    // return currentQuantity;
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

 // GET the saved User Details from crudcrud.
 window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/b46cdf29eb8a4e60949027aa0ce78ea3/candy")
    .then(res => {
        for(var i = 0; i < res.data.length;i++){
            displaySavedData(res.data[i])
            
        }
        console.log(res);
    })
    .catch(err => console.error(err));

})