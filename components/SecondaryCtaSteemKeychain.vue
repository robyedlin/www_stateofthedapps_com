<template>
  <div class="SecondaryCtaSteemKeychain">
    <div class="wrapper">
      <div class="icon-wrapper">
        <IconBadgeSteemKeychain 
          :width="35" 
          :height="35" 
          fill="white" />
      </div>
      <div class="description-wrapper">
        <h5 class="title-5">{{ $t(namespace('title')) }}</h5>
        <p class="description">{{ $t(namespace('description')) }} <a 
          class="link" 
          href="https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm?utm_source=StateOfTheDApps" 
          target="_blank" 
          rel="noopener"
          @click="trackSteemKeychainCta()">{{ $t(namespace('cta')) }}</a></p>
      </div>
      <div class="cta-wrapper">
        <a 
          href="https://chrome.google.com/webstore/detail/steem-keychain/lkcjlnjfpbikmcmbachjpdbijejflpcm?utm_source=StateOfTheDApps" 
          class="cta" 
          target="_blank" 
          rel="noopener"
          @click="trackSteemKeychainCta()">{{ $t(namespace('discover')) }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { trackSteemKeychainCta } from '~/helpers/mixpanel'
import IconBadgeSteemKeychain from './IconBadgeSteemKeychain'

export default {
  components: {
    IconBadgeSteemKeychain
  },
  data() {
    return {
      sourcePath: this.$route.path
    }
  },
  methods: {
    trackSteemKeychainCta() {
      const sourceComponent = 'SecondaryCtaSteemKeychain'
      const action = trackSteemKeychainCta(sourceComponent, this.sourcePath)
      this.$mixpanel.track(action.name, action.data)
    }
  }
}
</script>


<style lang="scss" scoped>
.SecondaryCtaSteemKeychain {
  background: rgba($color--black, 0.5);
  border-top: 1px solid rgba($color--black, 0.3);
}

.cta-wrapper {
  @include tweakpoint('min-width', 840px) {
    width: 25%;
    text-align: right;
  }
}

.cta {
  display: inline-block;
  border: 1px solid lighten($color--white, 100%);
  padding: 6px 20px;
  color: lighten($color--white, 100%);
  text-decoration: none;
  margin: 5px 0;
  border-radius: 1000px;
}

.description {
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.description-wrapper {
  margin: 15px;
  flex-grow: 1;
  @include tweakpoint('min-width', 840px) {
    margin: 0;
  }
}

.icon-wrapper {
  @include tweakpoint('min-width', 840px) {
    width: 25%;
    text-align: left;
  }
}

.link {
  color: lighten($color--white, 100%);
}

.title-5 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.wrapper {
  @include margin-wrapper-main;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  @include tweakpoint('min-width', 840px) {
    flex-direction: row;
  }
}
</style>
