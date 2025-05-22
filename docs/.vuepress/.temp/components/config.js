import { hasGlobalComponent } from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "/Users/Shawn/Desktop/code/vuepress-blog/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("VPCard")) app.component("VPCard", VPCard);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
