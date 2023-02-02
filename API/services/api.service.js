"use strict";

const ApiService = require("moleculer-web");

module.exports = {
	name: "api",
    mixins: [ApiService],
    settings: {
        routes: [{
            whitelist: [
                "image.resize"
            ],
            aliases: {
                "GET api/image": "image.resize"
            },
            mappingPolicy: true
        }]
    }
};