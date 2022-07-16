const PHONE_NUMBER = '6281234123412'
const PRODUCT_ON_CART = []
let TOTAL_PRICE = 0

//Cart
const cartIcon = document.querySelector('#cart-icon')
const cart = document.querySelector('.cart')
const cartClose = document.querySelector('#close-cart')

cartIcon.onclick = () => {
  cart.classList.remove("cart")
  cart.classList.add("cart-active")
};
cartClose.onclick = () => {
  cart.classList.remove("cart-active")
  cart.classList.add("cart")
}

//cart working
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

function ready() {
  const removeCartButtons = document.getElementsByClassName('cart-remove')

  for (let i = 0; i < removeCartButtons.length; i++) {
    const button = removeCartButtons[i]
    button.addEventListener('click', removeCartItem)
  }

  //Quantity changes
  const quantityInputs = document.getElementsByClassName('cart-quantity')
  for (let i = 0; i < quantityInputs.length; i++) {
    const input = quantityInputs[i]
    input.addEventListener('change', quantityChanged)
  }

  //Add cart
  const addCart = document.getElementsByClassName('add-cart')
  for (let i = 0; i < addCart.length; i++) {
    const button = addCart[i]
    button.addEventListener('click', addCartClicked)
  }

  //buy button
  document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked)
}

//buy button
function buyButtonClicked() {
  if (PRODUCT_ON_CART.length < 1) return 

  alert("Pesanan telah dibuat")
  const cartContent = document.getElementsByClassName('cart-content')[0]
  // clear all product in cart
  for (let i = 0; i < cartContent.childElementCount; i++) {
    cartContent.removeChild(cartContent.firstChild)
  }
  updateTotal()
}

//Add cart
function addCartClicked (event) {
  const button = event.target
  const product = button.parentElement
  const item = product.getElementsByClassName('product-title')[0].innerText
  const price = product.getElementsByClassName('price')[0].innerText
  const image = product.getElementsByClassName('product-img')[0].src
  addProductToCart(item, price, image)
}

function addProductToCart(item, price, image) {
  const cartShopBox = document.createElement('div')
  cartShopBox.classList.add('cart-box')

  const cartItem = document.getElementsByClassName('cart-content')[0]
  const cartItemName = cartItem.getElementsByClassName('cart-product-title')
  for (let i=0; i < cartItemName.length; i++) {
    if (cartItemName[i].innerText == item) {
      // increase quantity
      const quantityElement = cartItem.getElementsByClassName('cart-quantity')[i]
      const quantity = quantityElement.value;
      quantityElement.value = parseInt(quantity) + 1
      const index = PRODUCT_ON_CART.findIndex(items => items.name === item)
      PRODUCT_ON_CART[index].quantity = parseInt(quantity) + 1
      updateTotal()
      return
    }
  }

  PRODUCT_ON_CART.push({
    name: item,
    price: price,
    quantity: 1,
  })
  const cartBoxContent = `<img src="${image}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${item}</div>
                                <div class="cart-product-price">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>
                            <!-- Remove cart -->
                            <i class='bx bxs-trash cart-remove'></i>`

  cartShopBox.innerHTML = cartBoxContent
  cartItem.insertBefore(cartShopBox, cartItem.firstChild)
  cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
  cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
  updateTotal()
}


//Quantity change
function quantityChanged(event) {
  const input = event.target
  const index = PRODUCT_ON_CART.findIndex(items => items.name === input.parentElement.getElementsByClassName('cart-product-title')[0].innerText)
  PRODUCT_ON_CART[index].quantity = input.value
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1
    PRODUCT_ON_CART[index].quantity = 1
  }
  updateTotal()
}

//Remove item from cart
function removeCartItem(event) {
  const buttonClicked = event.target
  buttonClicked.parentElement.remove()
  const index = PRODUCT_ON_CART.findIndex(items => items.name === buttonClicked.parentElement.getElementsByClassName('cart-product-title')[0].innerText)
  PRODUCT_ON_CART.splice(index, 1)
  updateTotal()
}

//update total
function updateTotal() {
  const cartContent = document.getElementsByClassName('cart-content')[0]
  const cartBoxes = cartContent.getElementsByClassName('cart-box')
  let total = 0

  for (let i = 0; i < cartBoxes.length; i++) {
    const cartBox = cartBoxes[i]
    const priceElement = cartBox.getElementsByClassName('cart-product-price')[0]
    const quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
    const price = parseFloat(priceElement.innerText.replace("Rp", "").replace(",", ""))
    const quantity = quantityElement.value
    total = total + price * quantity
  }

  //Desimal
  total = Math.round(total * 100)/100
  TOTAL_PRICE = total

  const cartCount = document.getElementsByClassName('cart-count')[0]
  cartCount.innerText = cartBoxes.length
  document.getElementsByClassName('total-price')[0].innerText = 'Rp ' + total.toLocaleString()
}

