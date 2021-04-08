import $ from 'jquery'
import { throttle } from 'throttle-debounce'
import BaseSection from './base'
import { getScrollY } from '../core/utils'
import { events as AJAX_CART_EVENTS } from '../components/ajaxCart'

const selectors = {
  cartCount: '[data-cart-count]',
  cartToggle: '[data-ajax-cart-toggle]'
}

const classes = {
  hasItems: 'has-items',
  scrollTriggered: 'scroll-triggered'
}

const $window = $(window);

export default class HeaderSection extends BaseSection {
  constructor(container) {
    super(container, 'header');

    this.$cartCount = $(selectors.cartCount, this.$container);
    this.$cartToggle = $(selectors.cartToggle, this.$container);

    // Cache these values because we use them in the scroll handler
    this.prevY      = 0;
    this.dirChangeY = 0; // Scrolltop value when the user changes scroll direction
    this.scrollDirection    = null; // up / down
    this.scrollTriggerDistance = 40;
    this.scrollTriggered = false;
    this.callbacks = {
      onAJAXCartRender: this.onAJAXCartRender.bind(this),
      onScroll: throttle(100, this.onScroll.bind(this))
    };

    $window.on(AJAX_CART_EVENTS.RENDER, this.callbacks.onAJAXCartRender)
    $window.on('scroll', this.callbacks.onScroll)

    this.onScroll()
  }

  onUnload() {
    $window.off(AJAX_CART_EVENTS.RENDER, this.callbacks.onAJAXCartRender)
    $window.off('scroll', this.callbacks.onScroll)
  }

  onAJAXCartRender({ cart }) {
    this.$cartCount.text(cart.item_count)
    this.$cartToggle.toggleClass(classes.hasItems, cart.item_count > 0)
  }

  onScroll() {
    const y = getScrollY()
    const direction = y >= this.prevY ? 'down' : 'up';
    let scrollTriggered = false;

    if (direction !== this.scrollDirection) {
      this.dirChangeY = y;
    }    

    if (direction === 'down' && y > this.scrollTriggerDistance) { //  going down and scrolled past header natural height
      scrollTriggered = true;
    }
    else if (direction === 'up') {
      scrollTriggered = this.dirChangeY - y <= 50; //  going up and scrolled up 40px from last time we changed scroll direction
    }

    // For situations where we toggle content visibility and cause page jumps
    // Or we scroll past the top on mobile
    if (y <= 0) {
      scrollTriggered = false;
    }

    if (scrollTriggered !== this.scrollTriggered) {
      window.requestAnimationFrame(() => {
        this.$container.toggleClass(classes.scrollTriggered, scrollTriggered)
        this.scrollTriggered = scrollTriggered
      })
    }

    this.prevY = y;
    this.scrollDirection = direction;
  }
}
