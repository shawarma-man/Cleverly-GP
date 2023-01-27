"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
// Provide the path to your JSON credentials file
const storage = new storage_1.Storage({
    keyFilename: 'cleverly-372120-69762213ac56.json'
});
exports.default = storage;
