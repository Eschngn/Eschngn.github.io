import { sidebar } from "vuepress-theme-hope";

import { knowledgeBase } from "./knowledge-base.js";
import { demo } from "./demo.js";

export default sidebar({
    "/knowledge-base/": knowledgeBase,
    "/demo/": demo,
})