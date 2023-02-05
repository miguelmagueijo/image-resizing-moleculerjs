"use strict";

const { MoleculerError } = require("moleculer").Errors;
const { default: axios } = require("axios");
const sharp = require("sharp");

function isImage(url) {
    return /\.(jpg|jpeg|png|png|webp|avif|gif|svg)$/.test(url);
}

module.exports = {
	name: "image",
	actions: {
		resize: {
			cache: false,
			rest: "GET /",
            params: {
                url: {
                    type: "url",
                    optional: true,
                    default: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                    custom: (value) => {
                        if (!isImage(value))
                            throw new MoleculerError("url is not an image", 400, "BAD_REQUEST", { url: value });
                        
                        return value;
                    }
                },
                width: {
                    type: "number",
                    optional: true,
                    default: 400,
                    positive: true,
                    convert: true
                },
                height: {
                    type: "number",
                    optional: true,
                    default: 200,
                    positive: true,
                    convert: true
                },
                base64: {
                    type: "boolean",
                    optional: true,
                    default: false,
                    convert: true
                }
            },
			async handler(ctx) {
                const { url, width, height, base64: toBase64 } = ctx.params;
                console.log(ctx.params)

                let imgData;
                
                try {
                    imgData = await this.fetchImageData(url);
                } catch (e) {
                    throw new MoleculerError("Something went wrong while fetching image from url. Confirm url value.", 400, "BAD_REQUEST", { e })
                }

                try {
                    const resizedImg = await this.resizeImage(imgData, width, height);

                    if (toBase64)
                        return { image: resizedImg.toString("base64") };
                    
                    ctx.meta.$responseType = "image/jpg";
                    return resizedImg;
                } catch (e) {
                    throw new MoleculerError("Something went wrong while resizing the image.", 500, "INTERNAL_ERROR", { e })
                }
			}
		},
	},

	methods: {
        async fetchImageData(url) {
            return (await axios.get(url, { responseType: "arraybuffer" })).data;
        },
        
        async resizeImage(img, width, height) {
            return await sharp(img).resize(width, height).toBuffer();
        }
	}
};