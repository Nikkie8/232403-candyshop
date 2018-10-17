'use strict';

// --------------- catalog ---------------
var MODIFIERS = [
  'one',
  'two',
  'three',
  'four',
  'five'
];

var catalog = document.querySelector('.catalog__cards');
var catalogLoad = catalog.querySelector('.catalog__load');
var goodTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var getBasedOnAmountClass = function (amount) {
  var amountClass = 'card--little';

  if (amount > 5) {
    amountClass = 'card--in-stock';
  } else if (amount === 0) {
    amountClass = 'card--soon';
  }

  return amountClass;
};

var getRatingModifier = function (rating) {
  return MODIFIERS[rating - 1];
};

var getNutritionSugarMessage = function (isSugar) {
  return isSugar ? 'Содержит сахар' : 'Без сахара';
};

var getGoodsElement = function (good) {
  var goodElement = goodTemplate.cloneNode(true);
  goodElement.classList.add(getBasedOnAmountClass(good.amount));
  goodElement.querySelector('.star__count').textContent = '(' + good.rating.number + ')';
  goodElement.querySelector('.card__title').textContent = good.name;
  goodElement.querySelector('.card__characteristic').textContent = getNutritionSugarMessage(good.nutritionFacts.sugar) + '. ' + good.nutritionFacts.energy + ' ккал';
  goodElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents + '.';

  var goodRatingElement = goodElement.querySelector('.stars__rating');
  var goodRatingClass = 'stars__rating';
  goodRatingElement.classList = '';
  goodRatingElement.classList.add(goodRatingClass);
  goodRatingElement.classList.add(goodRatingClass + '--' + getRatingModifier(good.rating.value));
  goodRatingElement.textContent = 'Рейтинг: ' + good.rating.value + ' звёзд';

  var goodPriceElement = goodElement.querySelector('.card__price');
  var goodCurrencyElement = goodPriceElement.querySelector('.card__currency');
  var goodWeightElement = goodPriceElement.querySelector('.card__weight');
  goodWeightElement.textContent = '/ ' + good.weight + ' Г';
  goodPriceElement.textContent = good.price + ' ';
  goodPriceElement.appendChild(goodCurrencyElement);
  goodPriceElement.appendChild(goodWeightElement);

  var goodImageElement = goodElement.querySelector('.card__img');
  goodImageElement.src = good.image;
  goodImageElement.alt = good.name;

  return goodElement;
};

var randomGoods = window.data.getGoods();

var renderGoods = function () {
  catalog.classList.remove('catalog__cards--load');
  catalogLoad.classList.add('visually-hidden');

  window.utility.renderBlockOfElements(randomGoods, catalog, getGoodsElement);
};

renderGoods();

// --------------- favorite ---------------
var onAddToFavoriteClick = function (e) {
  if (e.target.classList.contains('card__btn-favorite')) {
    e.preventDefault();
    e.target.classList.toggle('card__btn-favorite--selected');
  }
};

catalog.addEventListener('click', onAddToFavoriteClick);

// --------------- cart ---------------
var cart = document.querySelector('.goods__cards');
var cartGoodTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var cartEmptyElement = cart.querySelector('.goods__card-empty');
var cartEmptyElementCopy = cartEmptyElement.cloneNode(true);
var goodsInCart = [];

var getGoodFromArray = function (arrayOfGoods, goodName) {
  return arrayOfGoods.find(function (item) {
    return item.name === goodName;
  });
};

var addGoodToCart = function (element, goodsInStore) {
  var goodName = element.querySelector('.card__title').textContent;
  var goodInStore = getGoodFromArray(goodsInStore, goodName);

  if (goodInStore.amount <= 0) {
    return;
  }

  goodInStore.amount--;

  var goodFromCart = getGoodFromArray(goodsInCart, goodInStore.name);

  if (goodFromCart) {
    goodFromCart.orderedAmount++;
  } else {
    goodsInCart.push(Object.assign({orderedAmount: 1}, {
      name: goodInStore.name,
      image: goodInStore.image,
      price: goodInStore.price
    }));
  }
};

var getCartElement = function (good) {
  var cartElement = cartGoodTemplate.cloneNode(true);

  cartElement.querySelector('.card-order__title').textContent = good.name;
  cartElement.querySelector('.card-order__price').textContent = good.price + ' ₽';
  cartElement.querySelector('.card-order__count').value = good.orderedAmount;

  var cartImageElement = cartElement.querySelector('.card-order__img');

  cartImageElement.src = good.image;
  cartImageElement.alt = good.name;

  return cartElement;
};

var renderCart = function () {
  var goodsInCartCount = goodsInCart.length;
  var goodsInCartLink = document.querySelector('.main-header__basket');

  if (goodsInCartCount === 0) {
    cart.textContent = '';
    cart.classList.add('goods__cards--empty');
    cart.appendChild(cartEmptyElementCopy);

    cartEmptyElement.classList.remove('visually-hidden');

    goodsInCartLink.textContent = 'В корзине ничего нет';

    return;
  }

  var totalPrice = 0;

  goodsInCart.forEach(function (current) {
    totalPrice += current.orderedAmount * current.price;
  });

  window.utility.renderBlockOfElements(goodsInCart, cart, getCartElement);

  cart.classList.remove('goods__cards--empty');

  cartEmptyElement.classList.add('visually-hidden');

  goodsInCartLink.textContent = 'В корзине ' + goodsInCartCount + ' товара на ' + totalPrice + '₽';
};

var onAddToCartClick = function (e) {
  if (e.target.classList.contains('card__btn')) {
    e.preventDefault();
    addGoodToCart(e.target.closest('.catalog__card'), randomGoods);
    renderCart();
    renderGoods();
  }
};

if (goodsInCart.length !== 0) {
  renderCart();
}

catalog.addEventListener('click', onAddToCartClick);

var getGoodNameFromCart = function (element) {
  return element.querySelector('.card-order__title').textContent;
};

var removeGoodFromCart = function (element, goodsInStore) {
  var goodName = getGoodNameFromCart(element);
  var goodInCart = getGoodFromArray(goodsInCart, goodName);
  var goodInCartIndex = goodsInCart.indexOf(goodInCart);

  goodsInCart.splice(goodInCartIndex, 1);

  var goodInStore = getGoodFromArray(goodsInStore, goodName);

  goodInStore.amount += goodInCart.orderedAmount;
};

var onRemoveFromCartClick = function (e) {
  if (e.target.classList.contains('card-order__close')) {
    e.preventDefault();
    removeGoodFromCart(e.target.closest('.card-order'), randomGoods);
    renderCart();
    renderGoods();
  }
};

cart.addEventListener('click', onRemoveFromCartClick);

var decreaseCartGoodAmount = function (element) {
  var goodName = getGoodNameFromCart(element);
  var goodInCart = getGoodFromArray(goodsInCart, goodName);
  var goodInStore = getGoodFromArray(randomGoods, goodName);

  if (goodInCart.orderedAmount <= 1) {
    removeGoodFromCart(element, randomGoods);
    return;
  }

  goodInCart.orderedAmount--;
  goodInStore.amount++;
};

var onDecreaseAmountClick = function (e) {
  if (e.target.classList.contains('card-order__btn--decrease')) {
    decreaseCartGoodAmount(e.target.closest('.card-order'));
    renderCart();
    renderGoods();
  }
};

cart.addEventListener('click', onDecreaseAmountClick);

var increaseCartGoodAmount = function (element) {
  var goodName = getGoodNameFromCart(element);
  var goodInCart = getGoodFromArray(goodsInCart, goodName);
  var goodInStore = getGoodFromArray(randomGoods, goodName);

  if (goodInStore.amount === 0) {
    return;
  }

  goodInCart.orderedAmount++;
  goodInStore.amount--;
};

var onIncreaseAmountClick = function (e) {
  if (e.target.classList.contains('card-order__btn--increase')) {
    increaseCartGoodAmount(e.target.closest('.card-order'));
    renderCart();
    renderGoods();
  }
};

cart.addEventListener('click', onIncreaseAmountClick);

// --------------- order ---------------
var orderForm = document.querySelector('.buy form');

var onEmailFieldInvalid = function (e) {
  var field = e.target;
  if (field.validity.typeMismatch) {
    field.setCustomValidity('Введите правильный e-mail');
  } else {
    field.setCustomValidity('');
  }
};

var emailField = orderForm.querySelector('#contact-data__email');
emailField.addEventListener('invalid', onEmailFieldInvalid);

// --------------- payment ---------------
var payment = document.querySelector('.payment');
var card = payment.querySelector('.payment__card-wrap');
var cardInputs = card.querySelectorAll('input');
var cash = payment.querySelector('.payment__cash-wrap');
var currentPaymentOption = payment.querySelector('.toggle-btn__input:checked').id;

var initPaymentOptions = function (current) {
  card.classList.add('visually-hidden');
  cash.classList.add('visually-hidden');
  payment.querySelector('.' + current + '-wrap').classList.remove('visually-hidden');

  window.utility.toggleFields(cardInputs, currentPaymentOption === 'payment__card');
};

initPaymentOptions(currentPaymentOption);

var renderCheckedPaymentOption = function (option) {
  if (currentPaymentOption) {
    payment.querySelector('.' + currentPaymentOption + '-wrap').classList.add('visually-hidden');
  }

  payment.querySelector('.' + option + '-wrap').classList.remove('visually-hidden');

  window.utility.toggleFields(cardInputs, option === 'payment__card');

  currentPaymentOption = option;
};

var onPaymentToggleClick = function (e) {
  if (e.target.classList.contains('toggle-btn__input')) {
    renderCheckedPaymentOption(e.target.id);
  }
};

payment.addEventListener('change', onPaymentToggleClick);

var onCardFieldInvalid = function (e) {
  var field = e.target;
  var cardNumber = field.value;
  var isValid = window.utility.checkCardValidity(cardNumber);

  if (!isValid) {
    field.setCustomValidity('Введите корректный номер карты.');
  }
};

var cardField = card.querySelector('#payment__card-number');
cardField.addEventListener('input', onCardFieldInvalid);

// --------------- delivery ---------------
var deliver = document.querySelector('.deliver');
var courier = deliver.querySelector('.deliver__courier');
var courierInputs = courier.querySelectorAll('input');
var store = deliver.querySelector('.deliver__store');
var storeInputs = store.querySelectorAll('input');
var currentDeliveryOption = deliver.querySelector('.toggle-btn__input:checked').id;

var setDeliveryFields = function (current) {
  window.utility.toggleFields(courierInputs, current === 'deliver__courier');
  window.utility.toggleFields(storeInputs, current !== 'deliver__courier');
};

var initDeliveryOptions = function (current) {
  courier.classList.add('visually-hidden');
  store.classList.add('visually-hidden');
  deliver.querySelector('.' + current).classList.remove('visually-hidden');

  setDeliveryFields(current);
};

initDeliveryOptions(currentDeliveryOption);

var renderCheckedDeliveryOption = function (option) {
  if (currentDeliveryOption) {
    deliver.querySelector('.' + currentDeliveryOption).classList.add('visually-hidden');
  }

  deliver.querySelector('.' + option).classList.remove('visually-hidden');

  setDeliveryFields(option);

  currentDeliveryOption = option;
};

var onDeliverToggleClick = function (e) {
  if (e.target.classList.contains('toggle-btn__input')) {
    renderCheckedDeliveryOption(e.target.id);
  }
};

deliver.addEventListener('change', onDeliverToggleClick);
