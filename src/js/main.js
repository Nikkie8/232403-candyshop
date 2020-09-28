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
import {render} from './helpers/common';
import {RenderPosition} from './consts';
import {getFilterTemplate} from './components/filter-component';
import {getOptionsTemplate} from './components/options-component';
import {getSortTemplate} from './components/sort-component';
import {getGoodTemplate} from './components/good-component';
import {getCatalogTemplate} from './components/catalog-component';
import {getLoadMoreTemplate} from './components/load-more-component';
import {getGoods} from './mocks/goods-mock';
import {
  getCategoryFilters,
  getNutritionFilters,
  getOptionFilters
} from './mocks/filter-mock';

const GOODS_COUNT = 6;

const goods = getGoods(GOODS_COUNT);
const categoryFilters = getCategoryFilters(goods);
const nutritionFilters = getNutritionFilters(goods);
const filterFormElement = document.querySelector('#filter-form');

render(
  filterFormElement,
  getFilterTemplate(nutritionFilters),
  RenderPosition.AFTER_BEGIN
);
render(
  filterFormElement,
  getFilterTemplate(categoryFilters),
  RenderPosition.AFTER_BEGIN
);

const priceRangeElement = document.querySelector('#filter-form-price');
const optionFilters = getOptionFilters(goods);

render(
  priceRangeElement,
  getOptionsTemplate(optionFilters),
  RenderPosition.AFTER_END
);

const showAllElement = document.querySelector('#filter-form-show-all');

render(showAllElement, getSortTemplate(), RenderPosition.BEFORE_BEGIN);

const catalogContainerElement = document
  .querySelector('.catalog__cards-wrap');

render(catalogContainerElement, getCatalogTemplate());
render(catalogContainerElement, getLoadMoreTemplate());

const catalogElement = catalogContainerElement
  .querySelector('.catalog__cards');

goods.forEach((good) => {
  render(catalogElement, getGoodTemplate(good));
});
