const FormData = require("form-data");
const axios = require("axios");

module.exports = {
    config: {
        name: "pins",
        author: "Allou Mohamed",
        version: "1.0.9",
        role: 2,
        countDown: 80,
        description: "get similar images in Pinterest",
        category: "search",
    },
    onStart: async function ({
        message, event
    }) {
        const im = event.messageReply.attachments.length > 0 ? event.messageReply.attachments[0].url: null;
        if (!im) return;

        const streams = await pint(im);

        const streamList = await Promise.all(streams.map(async (x) => await utils.getStreamFromUrl(x)));

        message.reply({
            attachment: streamList
        });
    }
};

async function pint(imageUrl) {
    const buf = (await axios.get(imageUrl, {
        responseType: 'arraybuffer'
    })).data;
    const formData = new FormData();
    formData.append('camera_type', '0');
    formData.append('source_type', '1');
    formData.append('video_autoplay_disabled', '1');
    formData.append('fields', 'pin.{description,id,created_at},pin.image_large_url');
    formData.append('page_size', '5');
    formData.append('image', buf, {
        filename: 'Caera.jpg', contentType: 'image/jpeg'
    });

    const headers = {
        'authorization': "Bearer MTQzMTU5NDo5MzEzMzA1MzUzNDk5NTE5NDk6OTIyMzM3MjAzNjg1NDc3NTgwNzoxfDE2OTU5NTc5Mzc6MC0tN2M4M2IzNGI3MzdjNDg0YmM2ZjZhZjM3ZTFmODlmMWM=",
        'user-agent': 'Pinterest for Android/11.29.2 (SM-G988N; 7.1.2)',
        'content-type': `multipart/form-data;`,
        ...formData.getHeaders(),
    };
    const response = await axios.post("https://api.pinterest.com/v3/visual_search/lens/search/", formData, {
        headers: headers,
    });
    return response.data.data.map(obj => obj.image_large_url);
};