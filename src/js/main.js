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
import OptionsComponent from './components/options-component';
import SortComponent from './components/sort-component';
import {render, RenderPosition} from './helpers/common';
import {getGoods} from './mocks/goods-mock';
import {getOptionFilters} from './mocks/filter-mock';
import GoodsModel from './models/goods-model';
import CatalogController from './controllers/catalog-controller';
import {SortType} from './consts';
import FiltersModel from './models/filters-model';
import FiltersListController from './controllers/filters-list-controller';

const GOODS_COUNT = 15;

const filtersModel = new FiltersModel();
const goodsModel = new GoodsModel();

goodsModel.setGoods(getGoods(GOODS_COUNT));

const filterFormElement = document.querySelector('#filter-form');
const filtersListController = new FiltersListController(
  filterFormElement,
  goodsModel,
  filtersModel
);

filtersListController.init();

const priceRangeElement = document.querySelector('#filter-form-price');
const optionFilters = getOptionFilters(goodsModel.getGoods());
const optionsComponent = new OptionsComponent(optionFilters);

render(
  priceRangeElement,
  optionsComponent,
  RenderPosition.AFTER_END
);

const catalogContainerElement = document
  .querySelector('.catalog__cards-wrap');
const catalogController = new CatalogController(
  catalogContainerElement,
  goodsModel,
  filtersModel
);

catalogController.init();

const showAllElement = document.querySelector('#filter-form-show-all');
const sortComponent = new SortComponent();

const sortGoods = (sortType) => {
  const goods = goodsModel.getGoods().slice();

  switch (sortType) {
    case SortType.PRICE_HIGH:
      return goods.sort((a, b) => b.price - a.price);
    case SortType.PRICE_LOW:
      return goods.sort((a, b) => a.price - b.price);
    case SortType.RATING:
      return goods.sort((a, b) => b.rating.value - a.rating.value);
    default:
      return goods;
  }
};

const onSortTypeChange = (sortType) => {
  const goods = sortGoods(sortType);

  catalogController.update(goods);
};

sortComponent.setOnSortTypeChange(onSortTypeChange);

render(
  showAllElement,
  sortComponent,
  RenderPosition.BEFORE_BEGIN
);


