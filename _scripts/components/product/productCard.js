import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import ProductDetailForm from './productDetailForm'
import ProductZoom from './productZoom'

const selectors = {
  gallery: '[data-gallery]',
  galleryImage: '[data-gallery-image]',
  productZoom: '[data-product-zoom]'
}

const classes = {
  ready: 'is-ready'
}

export default class ProductCard {
  constructor(el) {
    this.$el = $(el);
    this.$gallery = $(selectors.gallery, this.$el);
    this.$galleryImages = $(selectors.galleryImage, this.$el);
    this.$productZoom = $(selectors.productZoom, this.$el);

    this.productZoom = new ProductZoom(this.$productZoom);
    this.productDetailForm = new ProductDetailForm(
      $('[data-product-detail-form]', this.$el).first(),
      {
        enableHistoryState: false
      }
    )

    this.$galleryImages.on('click', this.onGalleryImageClick.bind(this))

    // Animate in...
    if (this.$gallery.length) {
      imagesLoaded(this.$el.get(0), () => {
        this.$el.addClass(classes.ready);
      })
    }
    else {
      this.$el.addClass(classes.ready);
    }
  }

  onGalleryImageClick(e) {
    this.productZoom.show();
    this.productZoom.goToImage($(e.currentTarget).index());
  }
}