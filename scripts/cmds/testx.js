const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "testx",
    aliases: [],
    author: "Team Calyx",
    version: "2.0",
    cooldowns: 5,
    role: 2,
    shortDescription: "Generate and select images using Tensor Global API",
    longDescription: "Generates two images based on a prompt and allows the user to select one.",
    category: "ai",
    guide: {
      en: "{pn} <prompt> [--ar <ratio>]",
      ar: "{pn} <الموجه> [--ar <نسبة>]"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    const startTime = Date.now();
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      let prompt = "";
      let ratio = "1:1";

      for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--ar=")) {
          ratio = args[i].split("=")[1];
        } else if (args[i] === "--ar" && args[i + 1]) {
          ratio = args[i + 1];
          i++;
        } else {
          prompt += args[i] + " ";
        }
      }

      prompt = prompt.trim();

      const cacheFolderPath = path.join(__dirname, "/tmp");
      if (!fs.existsSync(cacheFolderPath)) fs.mkdirSync(cacheFolderPath);

      const response = await axios.get("https://smfahim.xyz/tensor-global-apis", {
        params: {
          prompt,
          ratio,
          steps: 15,
          cfgScale: 7,
          negativePrompt: "blurry, low quality",
          imageCount: 2,
          baseModel: JSON.stringify({
            modelId: "757279507095956705",
            modelFileId: "758377756002093254"
          }),
          models: JSON.stringify([
            {
              modelId: "828145569831703264",
              modelFileId: "828145569830654690",
              weight: 0.8
            },
            {
              modelId: "814389498252213976",
              modelFileId: "814389498251165401",
              weight: 0.9
            },
            {
              modelId: "830023518512127910",
              modelFileId: "830023518511079336",
              weight: 0.5
            }
          ]),
          bearerTokens: JSON.stringify([
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg0NjQ1MzI0NDgxMjEzMTQxNywiZGV2aWNlSWQiOiI0MU1vZTJZVV9TcktkNm9TNExvdnYiLCJyZWZyZXNoVG9rZW4iOiIiLCJleHBpcmVUaW1lIjoyNTkyMDAwLCJleHAiOjE3NDU5NDQyNTN9.YHwhBabBxsbGr3PpnO8uVZ3TlxOTlOgG0SJFYFLCV9CdsUM_F5MjMKNZwl3iTcbBBWoBjLRnxJ84TdwMTZ8wRp70KkBhUZHTJb62jwPzPeJG5lmVbVI3JIQcqFIArXBcZUuPkPqz8A3ixZY8sOp6eA89EHqTit-TFPZWUa1g6bM62qAiNTUTCudG2DxTxAfkEPxmTFbgZerNtySHtaPW9E0MRtPHhHYRwcgUFnj3vlUGVkO8P8sFlSP9pxl52u4iPhNLvhnbjvziFCnviXavQPM71S1PXCRvfwJVFrZxUM05jNsUrGdJP4__AHiTLIiz8jJrl_QqJHMStXeQQbF_GA"
          ])
        }
      });

      const imageUrls = response.data.imageUrls?.slice(0, 2);
      if (!imageUrls || imageUrls.length < 2) throw new Error("Image URLs missing");

      const images = await Promise.all(
        imageUrls.map(async (imageURL, index) => {
          const imagePath = path.join(cacheFolderPath, `image_${index + 1}_${Date.now()}.jpg`);
          const writer = fs.createWriteStream(imagePath);
          const imageResponse = await axios({ url: imageURL, method: "GET", responseType: "stream" });
          imageResponse.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
          return imagePath;
        })
      );

      const loadedImages = await Promise.all(images.map(img => loadImage(img)));
      const width = loadedImages[0].width;
      const height = loadedImages[0].height;
      const canvas = createCanvas(width * 2, height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(loadedImages[0], 0, 0, width, height);
      ctx.drawImage(loadedImages[1], width, 0, width, height);

      const combinedImagePath = path.join(cacheFolderPath, `image_combined_${Date.now()}.jpg`);
      const buffer = canvas.toBuffer("image/jpeg");
      fs.writeFileSync(combinedImagePath, buffer);

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      const reply = await message.reply({
        body: `Select an image by responding with 1 or 2.`,
        attachment: fs.createReadStream(combinedImagePath)
      });

      global.GoatBot.onReply.set(reply.messageID, {
        commandName: this.config.name,
        messageID: reply.messageID,
        images,
        combinedImage: combinedImagePath,
        author: event.senderID
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      console.error("Image Generation Error:", error.response?.data || error.message);
      message.reply("❌ | Failed to generate image.");
    }
  },

  onReply: async function ({ message, event }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);
    if (!replyData || replyData.author !== event.senderID) return;

    try {
      const index = parseInt(event.body.trim());
      if (isNaN(index) || index < 1 || index > 2) {
        return message.reply("❌ | Invalid selection. Please reply with 1 or 2.");
      }

      const selectedImagePath = replyData.images[index - 1];
      await message.reply({
        attachment: fs.createReadStream(selectedImagePath)
      });
    } catch (error) {
      console.error("Reply Error:", error.message);
      message.reply("❌ | Failed to send selected image.");
    }
  }
};