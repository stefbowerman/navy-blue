import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import BaseSection from './base';

const selectors = {
  frame: '[data-frame]'
}

export default class SiteBackgroundSection extends BaseSection {
  constructor(container) {
    super(container, 'site-background')

    // this.$frames = $(selectors.frame, this.$container)
    this.$videos = $('video', this.$container)
    this.$images = $('img', this.$container);

    this.$images.each((i, img) => {
      const $frame = $(img).parent(selectors.frame)

      imagesLoaded($frame.get(0), () => {
        $frame.addClass('is-loaded')
      })
    })

    // this.$images.on('load loaded', this.onFrameContentLoad.bind(this))
    this.$videos.each((i, el) => $(el).one('play playing', this.onFrameContentLoad.bind(this)));

    // @TODO - Check if the video already playing when this runs, might not catch the first event
    // @TODO - trigger play programatically, add a delay?
  }

  onFrameContentLoad(e) {
    $(e.currentTarget).parent(selectors.frame).addClass('is-loaded');
  }
}