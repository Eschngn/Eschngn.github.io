import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { text: "知识库", icon: "hugeicons:knowledge-02", link: "/knowledge-base/" },
  {
    text: "随笔",
    icon: "material-symbols:note-alt-sharp",
    link: "/essay/",
  },
]);
