import $ from 'jquery';
import YouTubePlayer from 'youtube-player'
import imagesLoaded from 'imagesloaded'
import BaseSection from './base';

const selectors = {
  embed: '[data-embed][data-id]',
  embedCover: '[data-embed-cover]',
  embedPlayer: '[data-embed-player]'
}

const classes = {
  coverHidden: 'is-hidden',
  coverImageLoaded: 'img-loaded'
}

const PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED:      0,
  PLAYING:    1,
  PAUSED:     2,
  BUFFERING:  3,
  VIDEO_CUED: 5
}

class VideoEmbed {
  constructor(el) {
    this.$el = $(el)
    this.$cover = $(selectors.embedCover, this.$el)
    this.$player = $(selectors.embedPlayer, this.$el)

    this.player = YouTubePlayer(this.$player.get(0), {
      videoId: this.$el.data('id'),
      playerVars: {
        modestBranding: 1,
        rel: 0
      }
    });

    imagesLoaded(this.$cover.get(0), () => {
      this.$cover.addClass(classes.coverImageLoaded);
    })

    this.player.on('stateChange', this.onPlayerStateChange.bind(this));
    this.$cover.on('click', this.onCoverClick.bind(this))
  }

  onCoverClick() {
    this.player.seekTo(0)
    this.player.playVideo().then(() => {
      this.$cover.addClass(classes.coverHidden)
    })
  }

  onPlayerStateChange({ data }) {
    if (data === PLAYER_STATES.ENDED) {
      this.$cover.removeClass(classes.coverHidden) 
    }
  }
}

export default class PageVideosSection extends BaseSection {
  constructor(container) {
    super(container, 'page-videos')

    this.embeds = $.map($(selectors.embed, this.$container), (el) => new VideoEmbed(el))
  }
}
