// 二手盲盒商品数据（符合 JSON/Ajax 要求）
const productsData = [
    { 
        id: 1, 
        name: "泡泡玛特 Dimoo 动物王国", 
        category: "盲盒", 
        price: 39, 
        originalPrice: 69, 
        status: "已拆摆·无损", 
        imgUrl: "images/dimoo.png",
        description: "Dimoo动物王国系列，隐藏款概率高，盒况完好，仅拆摆无损"  // ← 添加这一行
    },
    { 
        id: 2, 
        name: "蜡笔小新 夏日大作战系列", 
        category: "手办", 
        price: 128, 
        originalPrice: 299, 
        status: "仅拆盒", 
        imgUrl: "images/labixiaoxin.png",
        description: "蜡笔小新夏日限定款，小新身穿夏日服装，萌趣可爱，配件齐全"  // ← 添加这一行
    },
    { 
        id: 3, 
        name: "三丽鸥 Hello Kitty 披萨店日记系列", 
        category: "盲盒", 
        price: 39, 
        originalPrice: 69, 
        status: "已拆摆·无损", 
        imgUrl: "images/hellokitty.png",
        description: "Hello Kitty披萨店主题，Kitty化身披萨厨师，造型可爱，配件精致"  // ← 添加这一行
    },
    { 
        id: 4, 
        name: "Skullpanda 光织园系列毛绒公仔挂件", 
        category: "手办", 
        price: 128, 
        originalPrice: 299, 
        status: "仅拆盒", 
        imgUrl: "images/skullpanda.png",
        description: "Skullpanda光织园毛绒挂件，柔软材质，复古田园风格，可挂包装饰"  // ← 添加这一行
    },
    { 
        id: 5, 
        name: "童话仙境 初音未来 睡美人Ver.", 
        category: "盲盒", 
        price: 39, 
        originalPrice: 69, 
        status: "已拆摆·无损", 
        imgUrl: "images/chuyinweilai.png",
        description: "初音未来童话仙境系列睡美人款，公主造型梦幻唯美，裙摆精致，收藏佳品"  // ← 添加这一行
    },
    { 
        id: 6, 
        name: "火影忍者 大战晓组织系列", 
        category: "手办", 
        price: 128, 
        originalPrice: 299, 
        status: "仅拆盒", 
        imgUrl: "images/huoyingrenzhe.png",
        description: "火影忍者晓组织主题系列，角色经典帅气，做工精细，动漫迷收藏必入"  // ← 添加这一行
    },
    { 
        id: 7, 
        name: "LABUBU 毛绒挂件 一代", 
        category: "盲盒", 
        price: 39, 
        originalPrice: 69, 
        status: "已拆摆·无损", 
        imgUrl: "images/labubu.png",
        description: "LABUBU毛绒挂件一代，软萌可爱，做工精致，可挂包/钥匙，萌趣百搭"  // ← 添加这一行
    },
    { 
        id: 8, 
        name: "海贼王 百兽凯多手办", 
        category: "手办", 
        price: 128, 
        originalPrice: 299, 
        status: "仅拆盒", 
        imgUrl: "images/haizeiwang.png",
        description: "百兽凯多霸气手办，造型威猛，细节丰富，海贼王粉丝必入收藏款"  // ← 添加这一行
    },
];