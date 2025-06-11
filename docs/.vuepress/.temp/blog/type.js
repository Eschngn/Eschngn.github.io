export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[13,0,18,19,20,21,22,23,1,8,7,6,14,15,9,10,11,12,16,17,24,25,2,3,4,5,26]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[9,13,16,0]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[18,19,20,21,22,23,1,13,8,7,6,14,15,9,10,11,12,16,17,0]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });

