<template>
  <div class="DappDetailBody">
    <div
      :class="dapp.categories && dapp.categories.length ? '-' + dapp.categories[0] : ''"
      class="wrapper">
      <DappDetailBodyHeading
        :direct="direct"
        :icon-small-url="dapp.iconSmallUrl"
        :name="dapp.name"
        :category="dapp.categories && dapp.categories.length ? dapp.categories[0] : ''"
        :teaser="dapp.teaser"/>
      <DappDetailBodyContent :dapp="dapp" />
      <p class="ctr-info">This page had <strong>{{ dapp.stats.impressions }} views</strong> and <strong>{{ dapp.stats.clicks }} clicks</strong> (<strong>{{ ctr }}% CTR</strong>) in the last 180 days</p>
    </div>
  </div>
</template>

<script>
import DappDetailBodyContent from './DappDetailBodyContent'
import DappDetailBodyHeading from './DappDetailBodyHeading'

export default {
  components: {
    DappDetailBodyContent,
    DappDetailBodyHeading
  },
  props: {
    dapp: {
      type: Object,
      required: true,
      default: () => ({
        categories: []
      })
    },
    direct: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ctr() {
      const ctr = this.dapp.stats.ctr
      return !isNaN(ctr) ? (ctr * 100).toFixed(0) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.DappDetailBody {
  @include margin-wrapper-main;
}

.ctr-info {
  text-align: center;
  font-size: 1.05rem;
  padding: 0 1rem;
}

.wrapper {
  background: lighten($color--white, 100%);
  max-width: 1200px;
  margin: 20px auto 40px auto;
  border-radius: 4px;
  box-shadow: 0 10px 20px rgba($color--black, 0.1);
  border-bottom: 10px solid $color--black;
  @include category-border-colors;
}
</style>
