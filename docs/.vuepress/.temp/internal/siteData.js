export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"zh-CN\",\"title\":\"Shawn's Blog\",\"description\":\"vuepress-theme-hope 的博客演示\",\"head\":[[\"link\",{\"rel\":\"icon\",\"href\":\"https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/favicon.ico\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
