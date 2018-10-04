'use strict';

// --------------- general functions ---------------
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomItemsFromArray = function (arr, count) {
  var totalListOfItems = arr.slice();
  var items = [];

  for (var i = 0; i < count; i++) {
    var randomIndex = getRandomInt(0, totalListOfItems.length - 1);
    items.push(totalListOfItems[randomIndex]);
    totalListOfItems.splice(randomIndex, 1);
  }

  return items;
};

var renderBlockOfElements = function (elements, container, callback) {
  container.textContent = '';

  var fragment = document.createDocumentFragment();

  elements.forEach(function (element) {
    fragment.appendChild(callback(element));
  });

  container.appendChild(fragment);
};

var toggleFields = function (container, isEnabled) {
  var fields = container.querySelectorAll('input');

  for (var i = 0; i < fields.length; i++) {
    fields[i].disabled = !isEnabled;
  }
};

// --------------- slider ---------------
var rangeSlider = document.querySelector('.range');
var rangeBar = rangeSlider.querySelector('.range__filter');
var rangeBarWidth = rangeBar.offsetWidth;
var rangeMinOutput = rangeSlider.querySelector('.range__price--min');
var rangeMaxOutput = rangeSlider.querySelector('.range__price--max');

var getRangeMovePercentage = function (element) {
  var rangeCurrentY = element.offsetLeft;
  return Math.round((rangeCurrentY / rangeBarWidth) * 100);
};

var renderRangePrice = function (element) {
  var moveX = getRangeMovePercentage(element);
  var output = rangeMaxOutput;

  if (element.classList.contains('range__btn--left')) {
    output = rangeMinOutput;
  }

  element.style.left = moveX + '%';
  output.textContent = moveX;
};

var onRangeButtonMouseup = function (e) {
  if (e.target.classList.contains('range__btn')) {
    renderRangePrice(e.target, e.clientX);
  }
};

rangeBar.addEventListener('mouseup', onRangeButtonMouseup);

// --------------- catalog ---------------
var NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];

var INGREDIENTS = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];

var IMAGES = [
  'gum-cedar.jpg',
  'gum-chile.jpg',
  'gum-eggplant.jpg',
  'gum-mustard.jpg',
  'gum-portwine.jpg',
  'gum-wasabi.jpg',
  'ice-cucumber.jpg',
  'ice-eggplant.jpg',
  'ice-garlic.jpg',
  'ice-italian.jpg',
  'ice-mushroom.jpg',
  'ice-pig.jpg',
  'marmalade-beer.jpg',
  'marmalade-caviar.jpg',
  'marmalade-corn.jpg',
  'marmalade-new-year.jpg',
  'marmalade-sour.jpg',
  'marshmallow-bacon.jpg',
  'marshmallow-beer.jpg',
  'marshmallow-shrimp.jpg',
  'marshmallow-spicy.jpg',
  'marshmallow-wine.jpg',
  'soda-bacon.jpg',
  'soda-celery.jpg',
  'soda-cob.jpg',
  'soda-garlic.jpg',
  'soda-peanut-grapes.jpg',
  'soda-russian.jpg'
];

var MODIFIERS = [
  'one',
  'two',
  'three',
  'four',
  'five'
];

var NUMBER_OF_GOODS = 26;

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

var getContents = function (count) {
  var ingredients = getRandomItemsFromArray(INGREDIENTS, count);
  var content = ingredients.join(', ');

  return content.charAt(0).toUpperCase() + content.slice(1);
};

var getGoods = function () {
  var goods = [];
  var names = NAMES.slice();
  var images = IMAGES.slice();

  for (var i = 0; i < NUMBER_OF_GOODS; i++) {
    var randomNameIndex = getRandomInt(0, names.length - 1);
    var randomName = names[randomNameIndex];
    var randomImageIndex = getRandomInt(0, images.length - 1);
    var randomImage = 'img/cards/' + images[randomImageIndex];

    names.splice(randomNameIndex, 1);
    images.splice(randomImageIndex, 1);

    var good = {
      name: randomName,
      image: randomImage,
      amount: getRandomInt(0, 20),
      price: getRandomInt(100, 1500),
      weight: getRandomInt(30, 300),
      rating: {
        value: getRandomInt(1, 5),
        number: getRandomInt(10, 900)
      },
      nutritionFacts: {
        sugar: !!getRandomInt(0, 1),
        energy: getRandomInt(70, 500),
        contents: getContents(3)
      }
    };

    goods.push(good);
  }

  return goods;
};

var randomGoods = getGoods();

var renderGoods = function () {
  catalog.classList.remove('catalog__cards--load');
  catalogLoad.classList.add('visually-hidden');

  renderBlockOfElements(randomGoods, catalog, getGoodsElement);
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

  renderBlockOfElements(goodsInCart, cart, getCartElement);

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

var validateRequired = function (field, fieldName) {
  if (field.validity.valueMissing) {
    field.setCustomValidity('Заполните ' + fieldName);
  } else {
    field.setCustomValidity('');
  }
};

var onNameFieldInvalid = function (e) {
  validateRequired(e.target, 'имя');
};

var nameField = orderForm.querySelector('#contact-data__name');
nameField.addEventListener('invalid', onNameFieldInvalid);

var onPhoneFieldInvalid = function (e) {
  validateRequired(e.target, 'номер телефона');
};

var phoneField = orderForm.querySelector('#contact-data__tel');
phoneField.addEventListener('invalid', onPhoneFieldInvalid);

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
var cash = payment.querySelector('.payment__cash-wrap');
var currentPaymentOption = payment.querySelector('.toggle-btn__input:checked').id;

var initPaymentOptions = function (current) {
  card.classList.add('visually-hidden');
  cash.classList.add('visually-hidden');
  payment.querySelector('.' + current + '-wrap').classList.remove('visually-hidden');

  toggleFields(card, currentPaymentOption === 'payment__card');
};

initPaymentOptions(currentPaymentOption);

var renderCheckedPaymentOption = function (option) {
  if (currentPaymentOption) {
    payment.querySelector('.' + currentPaymentOption + '-wrap').classList.add('visually-hidden');
  }

  payment.querySelector('.' + option + '-wrap').classList.remove('visually-hidden');

  currentPaymentOption = option;
};

var onPaymentToggleClick = function (e) {
  if (e.target.classList.contains('toggle-btn__input')) {
    renderCheckedPaymentOption(e.target.id);
  }

  toggleFields(card, e.target.id === 'payment__card');
};

payment.addEventListener('change', onPaymentToggleClick);

// --------------- delivery ---------------
var deliver = document.querySelector('.deliver');
var courier = deliver.querySelector('.deliver__courier');
var store = deliver.querySelector('.deliver__store');
var currentDeliveryOption = deliver.querySelector('.toggle-btn__input:checked').id;

var setDeliveryFields = function (current) {
  if (current === 'deliver__courier') {
    toggleFields(courier, true);
    toggleFields(store, false);
  } else {
    toggleFields(courier, false);
    toggleFields(store, true);
  }
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
