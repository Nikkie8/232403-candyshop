'use strict';

var catalog = document.querySelector('.catalog__cards');
var catalogLoad = catalog.querySelector('.catalog__load');
var goodTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var cartGoodTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var randomGoods = getGoods(26);
var cart = document.querySelector('.goods__cards');
var cartEmptyElement = cart.querySelector('.goods__card-empty');
var goodsInCart = getGoods(3);

renderGoods();
renderCart();

function renderGoods() {
  catalog.classList.remove('catalog__cards--load');
  catalogLoad.classList.add('visually-hidden');
  renderBlockOfElements(randomGoods, catalog, getGoodsElement);
}

function renderCart() {
  cart.classList.remove('goods__cards--empty');
  cartEmptyElement.classList.add('visually-hidden');
  renderBlockOfElements(goodsInCart, cart, getCartElement);
}

function renderBlockOfElements(elements, container, callback) {
  var fragment = document.createDocumentFragment();

  elements.forEach(function (element) {
    fragment.appendChild(callback(element));
  });

  container.appendChild(fragment);
}

function getGoodsElement(good) {
  var goodElement = goodTemplate.cloneNode(true);
  var goodPriceElement = goodElement.querySelector('.card__price');
  var goodCurrencyElement = goodPriceElement.querySelector('.card__currency');
  var goodWeightElement = goodPriceElement.querySelector('.card__weight');
  var goodRatingElement = goodElement.querySelector('.stars__rating');
  var goodImageElement = goodElement.querySelector('.card__img');
  var goodRatingClass = 'stars__rating';
  var goodRatingModificator = '';
  var goodElementAdditionalClass = 'card--little';
  var goodSugarMessage = 'Без сахара';

  goodRatingElement.classList = '';
  goodRatingElement.classList.add(goodRatingClass);

  if (good.amount > 5) {
    goodElementAdditionalClass = 'card--in-stock';
  } else if (good.amount === 0) {
    goodElementAdditionalClass = 'card--soon';
  }

  switch (good.rating.value) {
    case 1:
      goodRatingModificator = '--one';
      break;
    case 2:
      goodRatingModificator = '--two';
      break;
    case 3:
      goodRatingModificator = '--three';
      break;
    case 4:
      goodRatingModificator = '--four';
      break;
    case 5:
      goodRatingModificator = '--five';
      break;
    default:
      break;
  }

  if (good.nutritionFacts.sugar) {
    goodSugarMessage = 'Содержит сахар';
  }

  goodRatingElement.classList.add(goodRatingClass + goodRatingModificator);
  goodRatingElement.textContent = 'Рейтинг: ' + good.rating.value + ' звёзд';
  goodElement.classList.add(goodElementAdditionalClass);
  goodWeightElement.textContent = '/ ' + good.weight + ' Г';
  goodPriceElement.textContent = good.price + ' ';
  goodPriceElement.appendChild(goodCurrencyElement);
  goodPriceElement.appendChild(goodWeightElement);
  goodElement.querySelector('.star__count').textContent = '(' + good.rating.number + ')';
  goodElement.querySelector('.card__title').textContent = good.name;
  goodElement.querySelector('.card__characteristic').textContent = goodSugarMessage + '. ' + good.nutritionFacts.energy + ' ккал';
  goodElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents + '.';
  goodImageElement.src = good.image;
  goodImageElement.alt = good.name;

  return goodElement;
}

function getCartElement(good) {
  var cartElement = cartGoodTemplate.cloneNode(true);
  var cartImageElement = cartElement.querySelector('.card-order__img');

  cartElement.querySelector('.card-order__title').textContent = good.name;
  cartElement.querySelector('.card-order__price').textContent = good.price + ' ₽';
  cartImageElement.src = good.image;
  cartImageElement.alt = good.name;

  return cartElement;
}

function getGoods(numberOfGoods) {
  var GOOD_NAMES = [
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

  var goods = [];

  for (var i = 0; i < numberOfGoods; i++) {
    var randomNameIndex = getRandomInt(0, GOOD_NAMES.length - 1);
    var randomName = GOOD_NAMES[randomNameIndex];
    var randomImageIndex = getRandomInt(0, IMAGES.length - 1);
    var randomImage = 'img/cards/' + IMAGES[randomImageIndex];

    GOOD_NAMES.splice(randomNameIndex, 1);
    IMAGES.splice(randomImageIndex, 1);

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
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getContents(count) {
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

  var ingredients = [];

  for (var i = 0; i < count; i++) {
    var randomIndex = getRandomInt(0, INGREDIENTS.length - 1);
    ingredients.push(INGREDIENTS[randomIndex]);
    INGREDIENTS.splice(randomIndex, 1);
  }

  var content = ingredients.join(', ');

  return content.charAt(0).toUpperCase() + content.slice(1);
}
