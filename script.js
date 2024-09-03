let foodIcon = document.querySelector(".food-icon");
let dismiss = document.querySelector(".dismiss");
let placeOrder = document.querySelector(".place-order");
let body = document.querySelector("body");
let pizzaContainerHTML = document.querySelector(".pizza-container");
let burgerContainerHTML = document.querySelector(".burger-container");
let icecreamContainerHTML = document.querySelector(".icecream-container");
let mocktailContainerHTML = document.querySelector(".mocktail-container");
let foodButton = document.querySelector(".food-button");
let orderListHTML = document.querySelector(".order-list");
let itemCount = document.querySelector(".food-icon span");
let orderTotal = document.querySelector(".order-total");

let foodContainer = {
    pizzas: [],
    burgers: [],
    icecreams: [],
    mocktails: [],
};
let order = [];

foodIcon.addEventListener("click", () => {
    if (!body.classList.contains("show-order")) {
        body.classList.add("show-order");
        setTimeout(() => {
            body.classList.add("smoother");
        }, 500);
    } else {
        body.classList.remove("show-order");
        body.classList.remove("smoother");
    }
});

dismiss.addEventListener("click", () => {
    body.classList.toggle("show-order");
    body.classList.toggle("smoother");
});

placeOrder.addEventListener("click", () => {
    localStorage.setItem("total", totalPrice);
    window.location.href = "checkout.html";
});

const addDataToHTML = () => {
    pizzaContainerHTML.innerHTML = "";
    burgerContainerHTML.innerHTML = "";
    icecreamContainerHTML.innerHTML = "";
    mocktailContainerHTML.innerHTML = "";

    for (const category in foodContainer) {
        foodContainer[category].forEach((product) => {
            let newItem = document.createElement("div");
            newItem.classList.add("card");
            newItem.dataset.id = product.id;
            newItem.innerHTML = `<img
                            class="card-img-top"
                            src="${product.image}"
                        />
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">
                                ${product.description}
                            </p>
                            <a class='food-button'>
                            <span class='top-border'></span>
                            <span class='price-span'>₹${product.price}</span>
                            <span class='bottom-border'></span>
                            </a>
                        </div>`;
            if (category === "pizzas") {
                pizzaContainerHTML.appendChild(newItem);
            } else if (category === "burgers") {
                burgerContainerHTML.appendChild(newItem);
            } else if (category === "icecreams") {
                icecreamContainerHTML.appendChild(newItem);
            } else if (category === "mocktails") {
                mocktailContainerHTML.appendChild(newItem);
            }
        });
    }
};

[
    pizzaContainerHTML,
    burgerContainerHTML,
    icecreamContainerHTML,
    mocktailContainerHTML,
].forEach((container) => {
    container.addEventListener("click", (e) => {
        let clickPosition = e.target;
        if (clickPosition.classList.contains("food-button")) {
            let cardElement = clickPosition.closest(".card");
            let itemId = cardElement.dataset.id;
            addToOrder(itemId);
        } else if (clickPosition.classList.contains("price-span")) {
            cardElement = clickPosition.closest(".card");
            itemId = cardElement.dataset.id;
            addToOrder(itemId);
        }
    });
});

const addToOrder = (itemId) => {
    let posOfProdInOrder = order.findIndex((value) => value.itemId === itemId);
    if (order.length === 0) {
        order = [
            {
                itemId: itemId,
                quantity: 1,
            },
        ];
    } else if (posOfProdInOrder < 0) {
        order.push({
            itemId: itemId,
            quantity: 1,
        });
    } else {
        order[posOfProdInOrder].quantity++;
    }
    addOrderToHTML();
    addOrderToLS();
};

const addOrderToLS = () => {
    localStorage.setItem("order", JSON.stringify(order));
};

const saveTotal = () => {
    console.log("saver called");
    localStorage.setItem("total", totalPrice);
};

const addOrderToHTML = () => {
    orderListHTML.innerHTML = "";
    let totalQuantity = 0;
    totalPrice = 0;

    if (order.length > 0) {
        order.forEach((orderItem) => {
            totalQuantity += orderItem.quantity;
            let newOrder = document.createElement("div");
            newOrder.classList.add("item");
            newOrder.dataset.id = orderItem.itemId;
            let itemPosition = -1;
            let data;

            for (const category in foodContainer) {
                itemPosition = foodContainer[category].findIndex(
                    (value) => value.id == orderItem.itemId
                );
                if (itemPosition >= 0) {
                    data = foodContainer[category][itemPosition];
                    break;
                }
            }

            let itemTotalPrice = data.price * orderItem.quantity;
            totalPrice += itemTotalPrice;
            newOrder.innerHTML = `<div class="name">${data.name}</div>
                        <div class="price">₹${itemTotalPrice.toFixed(2)}</div>
                        <div class="quantity">
                            <span class="minus">-</span>
                            <span class="value">${orderItem.quantity}</span>
                            <span class="plus">+</span>
                        </div>`;
            orderListHTML.appendChild(newOrder);
        });
    }

    itemCount.innerHTML = totalQuantity;

    if (totalPrice > 0) {
        orderTotal.innerHTML = `Order total: ₹${totalPrice.toFixed(2)}`;
        placeOrder.disabled = false;
    } else {
        orderTotal.innerHTML = "";
        placeOrder.disabled = true;
    }
    saveTotal();
};

orderListHTML.addEventListener("click", (e) => {
    let clickPosition = e.target;
    let itemId, type;
    if (clickPosition.classList.contains("minus")) {
        itemId = clickPosition.parentElement.parentElement.dataset.id;
        type = "minus";
        updateOrder(itemId, type);
    } else if (clickPosition.classList.contains("plus")) {
        itemId = clickPosition.parentElement.parentElement.dataset.id;
        type = "plus";
        updateOrder(itemId, type);
    }
});

const updateOrder = (itemId, type) => {
    let posOfProdInOrder = order.findIndex((value) => value.itemId == itemId);
    if (posOfProdInOrder >= 0) {
        if (type == "plus") {
            order[posOfProdInOrder].quantity++;
        } else if (type == "minus") {
            let valueAfterChange = order[posOfProdInOrder].quantity - 1;
            if (valueAfterChange > 0) {
                order[posOfProdInOrder].quantity--;
            } else {
                order.splice(posOfProdInOrder, 1);
            }
        }
    }
    addOrderToHTML();
    addOrderToLS();
};

const initApp = () => {
    fetch("items.json")
        .then((response) => response.json())
        .then((data) => {
            foodContainer = data;
            addDataToHTML();

            if (localStorage.getItem("order")) {
                order = JSON.parse(localStorage.getItem("order"));
                addOrderToHTML();
            }
        });
};

initApp();
