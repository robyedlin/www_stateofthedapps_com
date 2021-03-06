import fallbackMessages from './lang/en-US'

const env = {
  apiUrl: process.env.API_URL || 'https://api.stateofthedapps.com/',
  cdnPublicPath: process.env.CDN_PUBLIC_PATH || '/_nuxt/',
  googleAnalytics: process.env.GOOGLE_ANALYTICS || 'UA-000000-1',
  fullstory: process.env.FULLSTORY,
  intercom: process.env.INTERCOM,
  mixpanel: process.env.MIXPANEL,
  mode: process.env.MODE || 'universal'
}

export default {
  build: {
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    publicPath: env.cdnPublicPath
  },
  mode: env.mode,
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    '@nuxtjs/router',
    ['@nuxtjs/google-analytics', { id: env.googleAnalytics }],
    '@nuxtjs/markdownit',
    [
      'nuxt-i18n',
      {
        baseUrl: 'https://www.stateofthedapps.com',
        defaultLocale: 'en',
        locales: [
          {
            code: 'en',
            name: 'English',
            iso: 'en-US',
            file: 'en-US.js'
          },
          {
            code: 'de',
            name: 'Deutsch',
            iso: 'de-DE',
            file: 'de-DE.js'
          },
          {
            code: 'fr',
            name: 'Français',
            iso: 'fr-FR',
            file: 'fr-FR.js'
          },
          {
            code: 'ko',
            name: '한국어',
            iso: 'ko-KR',
            file: 'ko-KR.js'
          },
          {
            code: 'vi',
            name: 'Tiếng Việt',
            iso: 'vi-VN',
            file: 'vi-VN.js'
          },
          {
            code: 'zh',
            name: '中文',
            iso: 'zh-CN',
            file: 'zh-CN.js'
          }
        ],
        lazy: true,
        langDir: 'lang/',
        seo: true,
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: fallbackMessages
          }
        }
      }
    ]
  ],
  axios: {
    baseUrl: env.apiUrl,
    proxyHeaders: false,
    retry: true,
    progress: false
  },
  serverMiddleware: ['~/middleware/logger'],
  css: ['~/assets/css/normalize.scss', '~/assets/css/fonts.css'],
  styleResources: {
    scss: ['~/assets/css/_settings.scss']
  },
  env: {
    apiUrl: env.apiUrl,
    fullstory: env.fullstory,
    intercom: env.intercom,
    mixpanel: env.mixpanel
  },
  head: {
    title:
      'State of the DApps — Blockchain Apps for Ethereum, EOS, Klaytn, NEO and More',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'The curated list of decentralized applications'
      },
      { hid: 'image', property: 'og:image', content: '/og-default.png' },
      { name: 'theme-color', content: '#333' }
    ],
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Overpass+Mono:400,700|Overpass:300,700|Noto+Sans+SC:400,700&amp;subset=chinese-simplified'
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180'
      },
      {
        rel: 'icon',
        href: '/favicon-32x32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        href: '/favicon-16x16.png',
        sizes: '16x16'
      },
      {
        rel: 'manifest',
        href: '/manifest.json'
      }
    ]
  },
  loading: { color: '#333' },
  markdownit: {
    injected: true,
    linkify: false,
    breaks: true,
    use: ['markdown-it-video']
  },
  plugins: [
    { src: '~/plugins/mixin' },
    { src: '~/plugins/polyfills', ssr: false },
    { src: '~/plugins/vue-config' },
    { src: '~/plugins/vue-filters' },
    { src: '~/plugins/mixpanel', ssr: false },
    { src: '~/plugins/clipboard', ssr: false }
    // { src: '~/plugins/intercom.js', ssr: false }
  ]
}
