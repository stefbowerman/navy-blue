import $ from 'jquery';
import Swiper from 'swiper';
import { isTouch } from '../../core/utils';
import { getBreakpointMinWidth } from '../../core/breakpoints';

const selectors = {
  background: '[data-zoom-background]',
  overlay: '[data-zoom-overlay]',
  overlayContent: '[data-zoom-overlay-content]',
  close: '[data-zoom-close]',
  slideshow: '[data-slideshow]'
}

const classes = {
  bodyZoomOpen: 'product-zoom-open',
  visible: 'is-visible'
}

const $body = $(document.body)

export default class ProductZoom {
  constructor(el) {
    this.$el = $(el);
    this.$background = $(selectors.background, this.$el);
    this.$overlay = $(selectors.overlay, this.$el);
    this.$overlayContent = $(selectors.overlayContent, this.$el);
    this.$slideshow = $(selectors.slideshow, this.$el);
    this.$slides = $('.swiper-slide', this.$slideshow);

    this.stateIsOpen = false
    this.imagesLoaded = false

    const mobileSettings = window.innerWidth < getBreakpointMinWidth('md');
    const effect = isTouch() && mobileSettings ? 'slide' : 'fade';
    const speed  = 700;
    const loop = this.$slides.length > 1;

    this.swiper = new Swiper(this.$slideshow.get(0), {
      loop: loop,
      speed: speed,
      effect: effect,
      simulateTouch: false,
      watchOverflow: true
    });

    this.$el.on('click', selectors.close, this.onCloseClick.bind(this))
    this.$el.on('click', 'img', () => {
      this.swiper.slideNext()
    })
  }

  show() {
    if (this.stateIsOpen) return

    this.stateIsOpen = true

    this.$el.show()


    setTimeout(() => {
      this.$background.addClass(classes.visible)
      this.$overlay.addClass(classes.visible)

      setTimeout(() => {
        this.onShow()
      }, 30)
    }, 20)

    $body.addClass(classes.bodyZoomOpen)
  }

  hide() {
    if (!this.stateIsOpen) return

    this.$overlay.removeClass(classes.visible)
    this.$background.removeClass(classes.visible)

    setTimeout(this.onHidden.bind(this), 550)
  }

  loadImages() {
    if (this.imagesLoaded) return

    this.$el.find('img').each((i, img) => {
      const $el = $(img)
      $el.attr('srcset', $el.data('srcset'));
      $el.attr('src', $el.data('src'));
      $el.attr({
        'data-srcset': null,
        'data-src': null
      });
    })

    this.imagesLoaded = true
  }

  goToImage(index) {
    console.log(index)
    this.swiper.slideToLoop(index, 0, false)
  }

  // Called *right* after the zoom is made visible
  onShow() {
    this.loadImages()
    this.swiper.update()
  }

  onShown() {

  }

  onHidden() {
    this.stateIsOpen = false
    $body.removeClass(classes.bodyZoomOpen)
    this.$el.hide()
    console.log('onHidden!')
  }

  onCloseClick(e) {
    e.preventDefault();
    this.hide();
  }

}