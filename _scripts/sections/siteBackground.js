import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import { clamp } from '../core/utils';
import BaseSection from './base';

const selectors = {
  frame: '[data-frame]'
}

export default class SiteBackgroundSection extends BaseSection {
  constructor(container) {
    super(container, 'site-background')

    this.$frames = $(selectors.frame, this.$container)
    this.$videos = $('video', this.$container)
    this.$images = $('img', this.$container);

    this.$frames.each((i, frame) => {
      const delay = Math.abs((((Math.random() - 0.5) * 1e3) * ((i + 1) * 0.5)) + (i * 1e3))
      const $frame = $(frame)
      const $img = $frame.find('img').first()
      const $video = $frame.find('video').first()
      const video = $video.get(0)

      const loadedCallback = () => {
        setTimeout(() => $frame.addClass('is-loaded'), clamp(delay, 500, 3500))
      }

      if ($img.length === 1) {
        imagesLoaded(frame, loadedCallback)
      }
      else if ($video.length === 1) {
        if (video.currentTime > 0 && !video.paused && video.readyState > 2) {
          loadedCallback()
        }
        else {
          $(video).one('play playing', loadedCallback)
        }
      }
    })
  }

}