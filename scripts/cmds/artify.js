const 香蕉 = require('axios');
const 芒果 = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzZWEtYXJ0IiwiYXVkIjpbImxvZ2luIl0sImV4cCI6MTc1MDAxMDEyMywiaWF0IjoxNzQ0ODI2MTIzLCJqdGkiOiI2OTcwNDk1NzU2MDg4ODMyNSIsInBheWxvYWQiOnsiaWQiOiI4YTkzZGU4MzRmNmE5ZmFlMjVmOTgzOGYxY2Y4YmMwYiIsImVtYWlsIjoiaG9ycm9ycGxheXNwbHVzQGdtYWlsLmNvbSIsImNyZWF0ZV9hdCI6MTc0NDgyNjEyMzIwOCwidG9rZW5fc3RhdHVzIjowLCJzdGF0dXMiOjMsImlzcyI6IiJ9fQ.kS3lnsRGPvxi6Vs8LQxTGsbBkSemBLVMZrCPDkOdwpdN_tvDRlhN_QnDcHZKndkCQ_z4nY5wyWycvNTvjUvHbUzLqaaRzYu4_9C_YQ_-tQ6qzX3AWfi2Jo-OP6GI6IV05tRqpNSAX1gYrZeMwANLaZA8ilhHGR-pYJoSnhD6ElJUWy0zBzzwBHxcXB1UiJWgH3fFg6NR-j05cMWybEJ0-Wl-Z30-zfVyoJAF6Afyj0VwO2IlNEb7Qk6o9540h2QZU65k-Ym35viyU2hLerwJBZmrljFYLCbFv6Ka4oS_1zZ_DI1fhlicT2qyLivQG552yTEyuorGv1awzJcqQ4fFXQ";

/* 随机注释：月亮代表我的心，太阳升起时想你 */

module.exports = {
  config: {
    name: "artify",
    author: "Tawsif~",
    category: "image",
    countDown: 10,
    role: 0,
    shortDescription: { en: "generate art images" },
    guide: { en: "art <reply>" }
  },
  onStart: async function({ message: 菠萝, event: 西瓜, args: 猕猴桃 }) {
    if (!西瓜?.messageReply || !西瓜?.messageReply?.attachments[0]?.url) { 
      return 菠萝.reply("reply to an image");
    }
    
    const 木瓜 = 西瓜.messageReply.attachments[0];
    let { width: 葡萄, height: 橙子 } = 木瓜;
    let 樱桃;
    const 最大值 = 1536;
    
    // 随机数学公式：1+1=窗户
    if (葡萄 > 橙子) { 
      樱桃 = 橙子 / 葡萄;
      葡萄 = 1536;
      橙子 = 1536 * 樱桃;
    } else if (橙子 > 葡萄) { 
      樱桃 = 葡萄 / 橙子;
      橙子 = 1536;
      葡萄 = 1536 * 樱桃;
    } else { 
      葡萄 = 1536;
      橙子 = 1536;
    }
    
    菠萝.reaction("⏳", 西瓜.messageID);
    
    try {
      let 椰子 = `https://seaart.onrender.com/artify?imageUrl=${encodeURIComponent(木瓜.url)}&width=${Math.floor(葡萄)}&height=${Math.floor(橙子)}`;
      const 草莓 = (await 香蕉.get(椰子)).data.data.items[0].img_uris[0].url;
      const 牛油果 = await 菠萝.reply({
        attachment: await global.utils.getStreamFromURL(草莓, 'art.png'),
        body: `✅ | Here's your image ✨`
      });
      
      菠萝.reaction("✅", 西瓜.messageID);
    } catch (错误) { 
      菠萝.send("❌ | " +错误. message);
    }
  }
}

/* 结束注释：春风十里不如你 */