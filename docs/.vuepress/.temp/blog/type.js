export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[7,8,18,19,20,21,22,23,9,2,1,0,16,17,3,4,5,6,14,15,24,25,10,11,12,13,26]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[3,7,14,8]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[18,19,20,21,22,23,9,7,2,1,0,16,17,3,4,5,6,14,15,8]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });

