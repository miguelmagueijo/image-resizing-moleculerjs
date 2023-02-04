"use strict";

const ApiService = require("moleculer-web");

module.exports = {
	name: "api",
    mixins: [ApiService],
    settings: {
        ip: process.env.API_HOST || "0.0.0.0",
        port: process.env.API_PORT || 3000,
        routes: [{
            whitelist: [
                "image.resize"
            ],
            cors: { origin: `http://${process.env.UI_HOST}:${process.env.UI_PORT}`, methods: ["GET"],  allowedHeaders: [], exposedHeaders: [], credentials: false, maxAge: 3600 },
            aliases: {
                "GET api/image": "image.resize"
            },
            mappingPolicy: true
        }]
    }
};