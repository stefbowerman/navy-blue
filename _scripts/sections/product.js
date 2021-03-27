import $ from 'jquery';
import BaseSection from './base';
import ProductCard from '../components/product/productCard'

const selectors = {
  productCard: '[data-product-card]'
}

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    this.productCard = new ProductCard($(selectors.productCard, this.$container).first())
  }
}
