import comp from "/Users/Shawn/Desktop/code/vuepress-blog/docs/.vuepress/.temp/pages/knowledge-base/java/index.html.vue"
const data = JSON.parse("{\"path\":\"/knowledge-base/java/\",\"title\":\"Java\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Java\",\"article\":false,\"feed\":false,\"sitemap\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"Java\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://mister-hope.github.io/knowledge-base/java/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Shawn's Blog\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Java\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null,\"excerpt\":\"\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
