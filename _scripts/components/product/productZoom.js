import $ from 'jquery';
import Swiper, { Navigation, Pagination, EffectFade } from 'swiper';
import imagesLoaded from 'imagesloaded';
import { isTouch } from '../../core/utils';
import { getBreakpointMinWidth } from '../../core/breakpoints';

const selectors = {
  overlay: '[data-zoom-overlay]',
  overlayContent: '[data-zoom-overlay-content]',
  close: '[data-zoom-close]',
  slideshow: '[data-slideshow]',
  pagination: '[data-pagination]',
  next: '[data-next]',
  prev: '[data-prev]'
}

const classes = {
  bodyZoomOpen: 'product-zoom-open',
  visible: 'is-visible'
}

const $body = $(document.body)

Swiper.use([Navigation, Pagination, EffectFade])

export default class ProductZoom {
  constructor(el) {
    this.$el = $(el);
    this.$overlay = $(selectors.overlay, this.$el);
    this.$overlayContent = $(selectors.overlayContent, this.$el);
    this.$slideshow = $(selectors.slideshow, this.$el);
    this.$slides = $('.swiper-slide', this.$slideshow);
    this.$pagination = $(selectors.pagination, this.$el);
    this.$next = $(selectors.next, this.$el);
    this.$prev = $(selectors.prev, this.$el);

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
      watchOverflow: true,
      navigation: {
        nextEl: this.$next.get(0),
        prevEl: this.$prev.get(0)
      },
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: this.$pagination.get(0),
        type: 'fraction',
        renderCustom: (swiper, current, total) => `${current}/${total}`
      }
    });

    this.$el.addClass(`effect-${effect}`)

    this.$el.on('click', selectors.close, this.onCloseClick.bind(this))

    if (!isTouch() && !mobileSettings && loop) {
      this.$slideshow.find('img')
        .on('click', () => this.swiper.slideNext())
        .css('cursor', 'e-resize')
    }

    this.loadImages()
  }

  show() {
    if (this.stateIsOpen) return

    this.stateIsOpen = true

    this.$el.show()

    setTimeout(() => {
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
    $body.removeClass(classes.bodyZoomOpen)

    setTimeout(this.onHidden.bind(this), 550)
  }

  loadImages() {
    if (this.imagesLoaded) return

    this.$el.find('img').each((i, img) => {
      const $el = $(img)
      
      // Loaded callback
      imagesLoaded(img, () => $el.addClass('is-loaded'));

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
    this.swiper.slideToLoop(index, 0, false)
  }

  // Called *right* after the zoom is made visible
  onShow() {
    this.swiper.update()
  }

  onShown() {

  }

  onHidden() {
    this.stateIsOpen = false
    this.$el.hide()
  }

  onCloseClick(e) {
    e.preventDefault();
    this.hide();
  }

}