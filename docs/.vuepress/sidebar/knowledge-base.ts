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
                    "java/basis/annotation",
                    "java/basis/proxy",
                ],
            },
            {
                text: "集合",
                icon: "lucide:container",
                collapsible: true,
                children: [
                    "java/collection/collection1",
                    "java/collection/collection2",    
                ],
            },
            {
                text: "IO",
                icon: "fluent:stream-20-regular",
                collapsible: true,
                children: [
                    "java/io/io1",
                ],
            },
            {
                text:"并发编程",
                icon:"hugeicons:threads-ellipse",
                collapsible: true,
                children:[
                    "java/concurrent/volatile",
                ]
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
                    "database/mysql/index2",   
                    "database/mysql/explain", 
                ],
            },
            {
                text: "Redis",
                icon: "devicon-plain:redis",
                collapsible: true,
                children: [
                    "database/redis/redis1",  
                    "database/redis/redis2",
                ],
            }
        ],
    },
]);
