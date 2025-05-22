import { arraySidebar } from "vuepress-theme-hope";

export const knowledgeBase = arraySidebar([
    {
        text: "Java",
        icon: "java",
        collapsible: true, // 可折叠
        children: [
            {
                text: "Java基础",
                collapsible: true,
                children: [
                    "java/basis/basis1", // 面向对象
                    "java/basis/basis2", // 关键字整理
                ],
            },
            {
                text: "Java集合",
                collapsible: true,
                children: [
                    "java/collection/collection1", // List源码分析
                    "java/collection/collection2",    // Map使用详解
                ],
            },
        ],
    },
    {
        text: "数据库",
        icon: "database",
        collapsible: true,
        children: [
            {
                text: "MySQL",
                collapsible: true,
                children: [
                    "database/mysql/index2",   // 索引解析
                    "database/mysql/explain", // 执行计划详解
                ],
            },
        ],
    },
]);
