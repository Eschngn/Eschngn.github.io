import { sidebar } from "vuepress-theme-hope";

import { knowledgeBase } from "./knowledge-base.js";
import { essay } from "./essay.js";

export default sidebar({
    "/knowledge-base/": knowledgeBase,
    "/essay/" :essay,
})