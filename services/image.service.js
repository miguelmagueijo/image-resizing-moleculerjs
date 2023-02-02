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
                    type: "string",
                    optional: true,
                    default: 400,
                    custom: (value) => {
                        const width = Number(value);

                        if (isNaN(width))
                            throw new MoleculerError("width param must be number", 400, "BAD_REQUEST", { width: value });

                        if (width <= 0)
                            throw new MoleculerError("width param must be greater than 0", 400, "BAD_REQUEST", { width: value });

                        return width;
                    }
                },
                height: {
                    type: "string",
                    optional: true,
                    default: 200,
                    custom: (value) => {
                        const height = Number(value);

                        if (isNaN(height))
                            throw new MoleculerError("height param must be number", 400, "BAD_REQUEST", { height: value });

                        if (height <= 0)
                            throw new MoleculerError("height param must be greater than 0", 400, "BAD_REQUEST", { height: value });

                        return height;
                    }
                },
                base64: {
                    type: "string",
                    optional: true,
                    default: false,
                    custom: (value) => {
                        if (typeof value === "boolean")
                            return Boolean(value);

                        if (value.toLowerCase() === "false")
                            return false;
                        
                        if (value.toLowerCase() === "true")
                            return true;
                        
                        throw new MoleculerError(`base64 param must be "true" or "false".`, 400, "BAD_REQUEST", { base64: value });
                    }
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
                    
                    return { image: resizedImg };
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