import BaseView from './base';
import PageVideosSection from '../sections/pageVideos';

export default class PageView extends BaseView {
  constructor($el, type) {
    super($el, type);

    this.sectionManager.register('page-videos', PageVideosSection)
  }
}
