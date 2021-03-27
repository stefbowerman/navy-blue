import BaseView from './base';
import FeaturedCollection from '../sections/featuredCollection';

export default class IndexView extends BaseView {
  constructor($el, type) {
    super($el, type);

    this.sectionManager.register('featured-collection', FeaturedCollection)
  }
}
