<template>
  <div class="CategoryPlatformFilters">
    <div class="filter-wrapper">
      <BaseDropdown
        :important="true"
        :options="platformOptions"
        :selected="platform"
        :all-text="$t('filters.allPlatforms')"
        :name="$t('platform')"
        :title="$t('filters.choosePlatform')"
        @select="filterPlatform"/>
    </div>
    <div class="filter-wrapper">
      <BaseDropdown
        :important="true"
        :options="categoryOptions"
        :selected="category ? $t(`categoryOptions.${$options.filters.capitalize(category)}`) : ''"
        :all-text="$t('filters.allCategories')"
        :name="$tc('category', 1)"
        :title="$t('filters.chooseCategory')"
        @select="filterCategory"/>
    </div>
  </div>
</template>

<script>
import { platformList, platformMap } from '~/helpers/constants'
import { getCategories } from '~/helpers/api'
import {
  trackDappCategoryFilter,
  trackDappPlatformFilter
} from '~/helpers/mixpanel'
import BaseDropdown from '~/components/BaseDropdown'

export default {
  components: {
    BaseDropdown
  },
  props: {
    baseRoute: {
      type: String,
      required: true,
      default: ''
    },
    routeHash: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      category: '',
      dappPlatforms: platformList(),
      dappCategories: [],
      platform: '',
      sourcePath: this.$route.path
    }
  },
  computed: {
    categoryOptions() {
      const options = this.dappCategories.map(x => {
        const optionObj = {
          text: this.$t(`categoryOptions.${x.name}`),
          selection: x.slug
        }
        return optionObj
      })
      return options
    },
    platformOptions() {
      const options = this.dappPlatforms.map(x => {
        const optionObj = {
          text: x,
          selection: x.toLowerCase()
        }
        return optionObj
      })
      return options
    }
  },
  async mounted() {
    const urlCategory = this.$route.params.category
    const platforms = platformMap()
    const urlPlatform = platforms[this.$route.params.platform]
    this.category = urlCategory
    this.platform = urlPlatform
    try {
      this.dappCategories = await getCategories(this.$axios)
    } catch (e) {
      this.$sentry.captureException(e)
    }
  },
  methods: {
    filterCategory(category) {
      this.category = category
      this.trackDappCategoryFilter(category)
      let routeName = this.baseRoute
      if (this.$route.params.platform) {
        routeName += '-platform'
      }
      if (category) {
        routeName += '-category'
      }
      this.$router
        .push(
          this.localePath({
            name: routeName,
            params: {
              ...this.$route.params,
              category: category.toLowerCase()
            },
            hash: this.routeHash
          })
        )
        .catch(err => {})
    },
    filterPlatform(platform) {
      const platforms = platformMap()
      this.platform = platforms[platform]
      this.trackDappPlatformFilter(platform)
      let routeName = this.baseRoute
      if (platform) {
        routeName += '-platform'
      }
      if (this.$route.params.category) {
        routeName += '-category'
      }
      this.$router
        .push(
          this.localePath({
            name: routeName,
            params: {
              ...this.$route.params,
              platform: platform.toLowerCase()
            },
            hash: this.routeHash
          })
        )
        .catch(err => {})
    },
    trackDappCategoryFilter(category) {
      const sourceComponent = 'CategoryPlatformFilter'
      const action = trackDappCategoryFilter(
        sourceComponent,
        this.sourcePath,
        category
      )
      this.$mixpanel.track(action.name, action.data)
    },
    trackDappPlatformFilter(platform) {
      const sourceComponent = 'CategoryPlatformFilter'
      const action = trackDappPlatformFilter(
        sourceComponent,
        this.sourcePath,
        platform
      )
      this.$mixpanel.track(action.name, action.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.CategoryPlatformFilters {
  padding-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-wrapper {
  width: 150px;
  margin: 0 5px;
}
</style>
