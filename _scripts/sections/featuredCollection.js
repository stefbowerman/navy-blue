import $ from 'jquery';
import BaseSection from './base';
import ProductCard from '../components/product/productCard'

const selectors = {
  productCard: '[data-product-card]'
}

export default class FeaturedCollectionSection extends BaseSection {
  constructor(container) {
    super(container, 'featured-collection')

    this.$container.find(selectors.productCard).each((i, el) => new ProductCard(el))
  }
}
