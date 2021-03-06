<template>
  <div
    v-on-clickaway="resetSearch"
    :class="[
      isSearching ? 'is-searching' : '',
      search.length ? 'has-input' : '',
      color]"
    class="GlobalSearch">
    <span
      :class="'-' + color"
      class="nav-link -search"><IconMagnifier :theme="isSearching || results ? 'black' : color"/></span>
    <div class="search-input-wrapper">
      <input
        ref="searchInput"
        :class="'-' + color"
        :value="search"
        :placeholder="$t(namespace('placeholder'))"
        class="search-input"
        @input="fetchResults($event.target.value)"
        @click="startSearch($event.target.value)"
        @keyup.enter="goToSearchPage">
    </div>
    <div
      v-if="results || isSearching"
      class="results">
      <div
        v-if="!results && searchCompleted"
        class="results-none">{{ $t(namespace('noResults')) }}</div>
      <div
        v-if="suggestions.length"
        class="suggestions-wrapper">
        <h3 class="results-title">{{ $t(namespace('suggestedTags')) }}</h3>
        <ul class="results-suggestions-list">
          <li
            v-for="(suggestion, index) in suggestions.slice(0, 7)"
            :key="index"
            class="results-suggestions-item">
            <nuxt-link
              :to="localePath({ name: 'dapps', query: {tags: suggestion} })"
              class="results-suggestions-link"
              @click.native="suggestionView(suggestion)">
              {{ suggestion }}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <br v-if="suggestions.length && dapps.length">
      <div
        v-if="dapps.length"
        class="dapps-wrapper">
        <h3 class="results-title">{{ $t(namespace('dapps')) }}</h3>
        <ul class="results-dapp-list">
          <li
            v-for="(dapp, index) in dapps.slice(0, 5)"
            :key="index"
            class="results-dapp-item">
            <nuxt-link
              :to="localePath({ name: 'dapp-detail', params: { slug: dapp.slug } })"
              class="results-dapp-link"
              @click.native="dappView(dapp.slug)">
              <span class="results-dapp-icon-wrapper">
                <img
                  v-if="dapp.iconSmallUrl"
                  :src="dapp.iconSmallUrl"
                  class="results-dapp-image"
                  width="42"
                  height="42">
                <span
                  v-else
                  class="results-dapp-icon-placeholder">{{ dapp.name | firstLetter }}</span>
              </span>
              <div class="results-dapp-info">
                <h4 class="results-dapp-title">{{ dapp.name }}</h4>
                <p class="results-dapp-tagline">{{ dapp.teaser }}</p>
              </div>
            </nuxt-link>
          </li>
        </ul>
        <div class="results-link-wrapper">
          <nuxt-link
            :to="localePath({name: 'dapps', query: {text: search} })"
            class="results-link"
            @click.native="resetSearch()">{{ $t(namespace('viewDappResults')) }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { trackDappView, trackSearchSuggestion } from '~/helpers/mixpanel'
import { directive as onClickaway } from 'vue-clickaway'
import { getCaretPosition } from '~/helpers/mixins'
import IconMagnifier from './IconMagnifier'

var searchTimer
var trackTimer

export default {
  components: {
    IconMagnifier
  },
  directives: {
    onClickaway: onClickaway
  },
  mixins: [getCaretPosition],
  props: {
    color: {
      type: String,
      required: true,
      default: ''
    },
    search: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      dapps: [],
      searchCompleted: false,
      searchStatus: false,
      sourcePath: this.$route.path,
      suggestions: []
    }
  },
  computed: {
    results() {
      return Boolean(this.dapps.length || this.suggestions.length)
    },
    isSearching() {
      return Boolean(this.searchStatus || this.search.length)
    }
  },
  methods: {
    dappView(targetDapp) {
      this.resetSearch()
      const sourceCollection = ''
      const sourceComponent = 'GlobalSearch'
      const action = trackDappView(
        sourceCollection,
        sourceComponent,
        this.sourcePath,
        targetDapp
      )
      this.$mixpanel.track(action.name, action.data)
    },
    goToSearchPage() {
      this.$router
        .push(
          this.localePath({
            name: 'dapps',
            query: {
              text: this.search
            }
          })
        )
        .catch(err => {})
    },
    suggestionView(suggestion) {
      this.resetSearch()
      const action = trackSearchSuggestion(this.sourcePath, suggestion)
      this.$mixpanel.track(action.name, action.data)
    },
    async fetchResults(value) {
      await this.$emit('setSearch', value)
      clearTimeout(searchTimer)
      clearTimeout(trackTimer)
      this.searchCompleted = false
      var caret = this.getCaretPosition(this.search)
      var result = /\S+$/.exec(this.search.slice(0, caret.end))
      var lastWord = result ? result[0] : null
      searchTimer = setTimeout(() => {
        this.$axios
          .get('tags', {
            params: {
              text: lastWord,
              excluded: [],
              type: 'dapps'
            }
          })
          .then(response => {
            const data = response.data
            const items = data.items
            this.suggestions = items
            this.searchCompleted = true
          })
        if (this.search.length > 1) {
          this.$axios
            .get('dapps', {
              params: {
                limit: 5,
                offset: 0,
                tags: [],
                text: this.search
              }
            })
            .then(response => {
              const data = response.data
              const items = data.items
              this.dapps = items
              this.searchCompleted = true
            })
        } else {
          this.dapps = []
        }
      }, 200)
      trackTimer = setTimeout(() => {
        if (this.search.length) {
          this.$mixpanel.track('Global - Search', { query: this.search })
        }
      }, 1000)
    },
    endSearch() {
      this.searchStatus = false
    },
    resetSearch() {
      this.$emit('setSearch', '')
      this.searchStatus = false
      this.suggestions = []
      this.dapps = []
      if (this.$refs.searchInput) {
        this.$refs.searchInput.blur()
      }
    },
    startSearch(value) {
      this.searchStatus = true
      this.fetchResults(value)
    }
  }
}
</script>


<style lang="scss" scoped>
.GlobalSearch {
  display: flex;
  align-items: center;
  border: 1px solid $color--black;
  padding: 7px 12px;
  border-radius: 1000px;
  min-width: 250px;
  position: relative;
  color: $color--black;
  &.is-searching {
    background: $color--white;
    box-shadow: 0 0 10px rgba($color--black, 0.1);
    border-color: transparent;
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    input {
      color: $color--black;
    }
  }
  &.has-input {
    @include tweakpoint('min-width', 975px) {
      min-width: 400px;
    }
  }
  &.white {
    border-color: rgba(white, 0.9);
    &.is-searching {
      border-color: transparent;
    }
  }
}

.nav-link {
  position: relative;
  z-index: 15;
  &.-search {
    width: 17px;
    height: 17px;
  }
}

.results {
  position: absolute;
  top: 100%;
  left: -1px;
  width: calc(100% + 2px);
  background: $color--white;
  z-index: 50;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0 5px 10px rgba($color--black, 0.1);
  color: $color--black;
  padding: 12px;
  text-align: left;
  overflow: hidden;
}

.results-dapp-icon-placeholder {
  display: block;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  text-transform: uppercase;
  background: $color--gray;
}

.results-dapp-icon-wrapper {
  width: 42px;
  height: 42px;
}

.results-dapp-link {
  display: block;
  padding: 10px 0;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
  transition: background 0.05s ease;
  &:hover {
    background: lighten($color--gray, 2%);
  }
}

.results-dapp-image {
  display: block;
  border-radius: 4px;
}

.results-dapp-title {
  margin: 0;
}

.results-dapp-tagline {
  margin: 0;
}

.results-dapp-info {
  padding-left: 10px;
}

.results-link {
  font-size: 0.9rem;
  font-weight: 600;
}

.results-link-wrapper {
  padding-top: 10px;
  text-align: right;
}

.results-none {
  text-align: center;
}

.results-title {
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.25px;
  font-weight: 700;
}

.results-suggestions-list {
  display: flex;
  flex-wrap: wrap;
}

.results-suggestions-link {
  display: block;
  padding: 5px 8px;
  text-decoration: none;
  background: $color--gray;
  border-radius: 1000px;
  margin: 3px 5px;
  margin-left: 0;
  &:hover {
    text-decoration: underline;
  }
}

.search-input-wrapper {
  position: relative;
  z-index: 15;
  flex-grow: 1;
  padding-left: 8px;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  color: $color--black;
  &::placeholder {
    color: $color--black;
  }
  &.-white {
    color: $color--white;
    &::placeholder {
      color: $color--white;
      .is-searching & {
        color: $color--black;
      }
    }
  }
}
</style>
