import './utility';
import './ajax';
import './modal';
import './goods';
import './payment';
import './delivery';
import './filter';
import './slider';
import './catalog';
import './order';
import FilterComponent from './components/filter-component';
import OptionsComponent from './components/options-component';
import SortComponent from './components/sort-component';
import CatalogComponent from './components/catalog-component';
import LoadMoreComponent from './components/load-more-component';
import {render, RenderPosition} from './helpers/common';
import {getGoods} from './mocks/goods-mock';
import {
  getCategoryFilters,
  getNutritionFilters,
  getOptionFilters
} from './mocks/filter-mock';
import NoGoodsComponent from './components/no-goods-component';
import GoodController from './controllers/good-controller';

const GOODS_COUNT = 15;
const GOODS_COUNT_STEP = 6;

const goods = getGoods(GOODS_COUNT);
const categoryFilters = getCategoryFilters(goods);
const nutritionFilters = getNutritionFilters(goods);
const filterFormElement = document.querySelector('#filter-form');

render(
  filterFormElement,
  new FilterComponent(nutritionFilters),
  RenderPosition.AFTER_BEGIN
);
render(
  filterFormElement,
  new FilterComponent(categoryFilters),
  RenderPosition.AFTER_BEGIN
);

const priceRangeElement = document.querySelector('#filter-form-price');
const optionFilters = getOptionFilters(goods);
const optionsComponent = new OptionsComponent(optionFilters);

render(
  priceRangeElement,
  optionsComponent,
  RenderPosition.AFTER_END
);

const showAllElement = document.querySelector('#filter-form-show-all');

render(
  showAllElement,
  new SortComponent(),
  RenderPosition.BEFORE_BEGIN
);

const catalogContainerElement = document
  .querySelector('.catalog__cards-wrap');

render(catalogContainerElement, new CatalogComponent());

const catalogElement = catalogContainerElement
  .querySelector('.catalog__cards');

const renderGood = (good) => {
  const goodController = new GoodController(catalogElement, good);

  goodController.init();
};

if (goods.length > GOODS_COUNT_STEP) {
  let renderedGoodsCount = GOODS_COUNT_STEP;

  const loadMoreComponent = new LoadMoreComponent();

  render(catalogContainerElement, loadMoreComponent);

  const onLoadMoreClick = () => {
    goods.slice(renderedGoodsCount, renderedGoodsCount + GOODS_COUNT_STEP)
      .forEach((good) => {
        renderGood(good);
      });

    renderedGoodsCount += GOODS_COUNT_STEP;

    if (renderedGoodsCount >= goods.length) {
      loadMoreComponent.getElement().remove();
      loadMoreComponent.removeElement();
    }
  };

  loadMoreComponent.setOnClick(onLoadMoreClick);
}

if (goods.length === 0) {
  render(catalogContainerElement, new NoGoodsComponent());
} else {
  goods.slice(0, GOODS_COUNT_STEP).forEach((good) => {
    renderGood(good);
  });
}
