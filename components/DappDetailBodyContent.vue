<template>
  <div class="DappDetailBodyContent">
    <div class="wrapper">
      <div class="wrapper-inner">
        <DappAlert
          v-if="dapp.alert"
          :alert="dapp.alert"/>
        <DappDetailBodyContentImage
          v-if="dapp.productImage"
          :product-image="dapp.productImage"
          :title="dapp.name + ' - ' + dapp.teaser"/>
        <DappDetailBodyContentDescription
          v-if="dapp.description"
          :description="dapp.description"/>
        <media :query="{maxWidth: 1000}">
          <div>
            <DappDetailBodyContentCtas :dapp="dapp"/>
            <DappDetailBodyContentPlatform
              v-if="dapp.platform"
              :platform="dapp.platform"
              :tags="dapp.tags"
              :slug="dapp.slug"/>
          </div>
        </media>
        <DappDetailBodyContentModules :dapp="dapp"/>
        <DappDetailBodyContentReviews
          v-if="dapp.reviews && dapp.reviews.length"
          :reviews="dapp.reviews"/>
      </div>
      <div class="actions-related">
        <media :query="{minWidth: 1000}">
          <div>
            <DappDetailBodyContentCtas :dapp="dapp"/>
            <DappDetailBodyContentPlatform
              v-if="dapp.platform"
              :platform="dapp.platform"
              :tags="dapp.tags"
              :slug="dapp.slug"/>
          </div>
        </media>
        <style>
          #cf {
          margin-left: 10px;
          margin-right: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid #dfdfdf;
          }
          .cf-wrapper {
          background: #f8f8f8;
          font-family: 'Overpass', sans-serif !important;
          margin-bottom: 24px !important;
          }
          .cf-powered-by {
          display: block !important;
          float: none !important;
          text-align: right;
          }
        </style>
        <DappDetailBodyContentRecommend
          :name="dapp.name"
          :slug="dapp.slug"
          :rating="dapp.stats.star_rating || null"
          :votes="dapp.stats.votes"
          :positive="dapp.stats.positive"
          :neutral="dapp.stats.netural"
          :negative="dapp.stats.negative"/>
        <DappDetailBodyContentRank
          v-if="dapp.rank"
          :rank="dapp.rank"
          :rank-delta="dapp.rankDelta"/>
        <DappDetailBodyContentOwner
          :name="dapp.name"
          :slug="dapp.slug"/>
        <DappProfile
          v-if="dapp.profileScore"
          :dapp="dapp.slug"
          :profile-score="dapp.profileScore"/>
        <DappDetailBodyContentCategories
          v-if="dapp.categories && dapp.categories.length"
          :slug="dapp.slug"
          :categories="dapp.categories"/>
        <DappDetailBodyContentTags
          v-if="dapp.tags && dapp.tags.length"
          :slug="dapp.slug"
          :tags="dapp.tags"/>
        <DappDetailBodyContentTools
          :name="dapp.name"
          :slug="dapp.slug"/>
      </div>
    </div>
  </div>
</template>

<script>
import Media from 'vue-media'
import DappAlert from './DappAlert'
import DappDetailBodyContentCategories from './DappDetailBodyContentCategories'
import DappDetailBodyContentCtas from './DappDetailBodyContentCtas'
import DappDetailBodyContentDescription from './DappDetailBodyContentDescription'
import DappDetailBodyContentImage from './DappDetailBodyContentImage'
import DappDetailBodyContentModules from './DappDetailBodyContentModules'
import DappDetailBodyContentPlatform from './DappDetailBodyContentPlatform'
import DappDetailBodyContentRank from './DappDetailBodyContentRank'
import DappDetailBodyContentReviews from './DappDetailBodyContentReviews'
import DappDetailBodyContentRecommend from './DappDetailBodyContentRecommend'
import DappDetailBodyContentTags from './DappDetailBodyContentTags'
import DappDetailBodyContentTools from './DappDetailBodyContentTools'
import DappProfile from './DappProfile'
import DappDetailBodyContentOwner from './DappDetailBodyContentOwner'

export default {
  components: {
    DappDetailBodyContentOwner,
    DappAlert,
    DappDetailBodyContentCategories,
    DappDetailBodyContentCtas,
    DappDetailBodyContentDescription,
    DappDetailBodyContentImage,
    DappDetailBodyContentModules,
    DappDetailBodyContentPlatform,
    DappDetailBodyContentRank,
    DappDetailBodyContentRecommend,
    DappDetailBodyContentReviews,
    DappDetailBodyContentTags,
    DappDetailBodyContentTools,
    DappProfile,
    Media
  },
  props: {
    dapp: {
      type: Object,
      required: true,
      default: () => ({
        categories: [],
        reviews: [],
        stats: {},
        tags: []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-bottom: 20px;
  @include tweakpoint('min-width', 1000px) {
    margin-bottom: 0;
    display: flex;
    padding: 75px;
  }
  @include tweakpoint('min-width', 1200px) {
    display: flex;
    padding: 75px 100px;
  }
}

.wrapper-inner {
  @include tweakpoint('min-width', 1000px) {
    flex: 1;
    padding-right: 10px;
  }
}

.actions-related {
  @include tweakpoint('min-width', 1000px) {
    width: 190px;
    padding-left: 10px;
  }
}
</style>
