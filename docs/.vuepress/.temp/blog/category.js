export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"樱桃\":{\"path\":\"/category/%E6%A8%B1%E6%A1%83/\",\"indexes\":[0]},\"火龙果\":{\"path\":\"/category/%E7%81%AB%E9%BE%99%E6%9E%9C/\",\"indexes\":[1]},\"水果\":{\"path\":\"/category/%E6%B0%B4%E6%9E%9C/\",\"indexes\":[2,1,3,4,5,6]},\"草莓\":{\"path\":\"/category/%E8%8D%89%E8%8E%93/\",\"indexes\":[2]},\"蔬菜\":{\"path\":\"/category/%E8%94%AC%E8%8F%9C/\",\"indexes\":[7]},\"使用指南\":{\"path\":\"/category/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/\",\"indexes\":[8,9,10,11,12]},\"指南\":{\"path\":\"/category/%E6%8C%87%E5%8D%97/\",\"indexes\":[13]},\"苹果\":{\"path\":\"/category/%E8%8B%B9%E6%9E%9C/\",\"indexes\":[5,6,14,15]},\"香蕉\":{\"path\":\"/category/%E9%A6%99%E8%95%89/\",\"indexes\":[16,17,3,4]},\"数据库\":{\"path\":\"/category/%E6%95%B0%E6%8D%AE%E5%BA%93/\",\"indexes\":[18,19]},\"Mysql\":{\"path\":\"/category/mysql/\",\"indexes\":[18]},\"Java\":{\"path\":\"/category/java/\",\"indexes\":[20,21,22,23]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"红\":{\"path\":\"/tag/%E7%BA%A2/\",\"indexes\":[7,2,1,0,5,6,14,15]},\"小\":{\"path\":\"/tag/%E5%B0%8F/\",\"indexes\":[2,0]},\"圆\":{\"path\":\"/tag/%E5%9C%86/\",\"indexes\":[7,0,5,6,14,15]},\"大\":{\"path\":\"/tag/%E5%A4%A7/\",\"indexes\":[1,5,6,14,15]},\"禁用\":{\"path\":\"/tag/%E7%A6%81%E7%94%A8/\",\"indexes\":[11]},\"加密\":{\"path\":\"/tag/%E5%8A%A0%E5%AF%86/\",\"indexes\":[12]},\"布局\":{\"path\":\"/tag/%E5%B8%83%E5%B1%80/\",\"indexes\":[13]},\"Markdown\":{\"path\":\"/tag/markdown/\",\"indexes\":[9]},\"页面配置\":{\"path\":\"/tag/%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE/\",\"indexes\":[8]},\"使用指南\":{\"path\":\"/tag/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/\",\"indexes\":[8]},\"黄\":{\"path\":\"/tag/%E9%BB%84/\",\"indexes\":[16,17,3,4]},\"弯曲的\":{\"path\":\"/tag/%E5%BC%AF%E6%9B%B2%E7%9A%84/\",\"indexes\":[16,17,3,4]},\"长\":{\"path\":\"/tag/%E9%95%BF/\",\"indexes\":[16,17,3,4]},\"Mysql执行计划\":{\"path\":\"/tag/mysql%E6%89%A7%E8%A1%8C%E8%AE%A1%E5%88%92/\",\"indexes\":[18]},\"Mysql索引\":{\"path\":\"/tag/mysql%E7%B4%A2%E5%BC%95/\",\"indexes\":[19]},\"Java基础\":{\"path\":\"/tag/java%E5%9F%BA%E7%A1%80/\",\"indexes\":[20,21]},\"Java集合\":{\"path\":\"/tag/java%E9%9B%86%E5%90%88/\",\"indexes\":[22,23]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

