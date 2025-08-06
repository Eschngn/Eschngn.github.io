import { arraySidebar } from "vuepress-theme-hope";

export const knowledgeBase = arraySidebar([
    "",
    {
        text: "Java",
        icon: "cib:java",
        collapsible: true, // 可折叠
        children: [
            {
                text: "基础",
                icon: "hugeicons:abacus",
                collapsible: true,
                children: [
                    "java/basis/basis1", 
                    "java/basis/basis2", 
                    "java/basis/modifier",
                    "java/basis/string",
                    "java/basis/exception",
                    "java/basis/generics",
                    "java/basis/reflection",
                    "java/basis/annotation"
                ],
            },
            {
                text: "集合",
                icon: "lucide:container",
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
        icon: "material-symbols:database-outline",
        collapsible: true,
        children: [
            {
                text: "MySQL",
                icon: "lineicons:mysql",
                collapsible: true,
                children: [
                    "database/mysql/index2",   // 索引解析
                    "database/mysql/explain", // 执行计划详解
                ],
            },
            {
                text: "Redis",
                icon: "devicon-plain:redis",
                collapsible: true,
                children: [
                    "database/redis/redis1",   // 索引解析
                    "database/redis/redis2", // 执行计划详解
                ],
            }
        ],
    },
]);
