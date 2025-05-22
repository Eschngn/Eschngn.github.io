import { hasGlobalComponent } from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/@vuepress/plugin-icon/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "fa6-solid:",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
