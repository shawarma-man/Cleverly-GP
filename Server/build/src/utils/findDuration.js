"use strict";
// duration.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDurationFromBuffer = void 0;
const get_video_duration_1 = __importDefault(require("get-video-duration"));
const buffer_to_stream_1 = __importDefault(require("buffer-to-stream"));
function getDurationFromBuffer(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const durationInSeconds = yield (0, get_video_duration_1.default)((0, buffer_to_stream_1.default)(buffer));
        const duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);
        return duration;
    });
}
exports.getDurationFromBuffer = getDurationFromBuffer;
// export async function getDuration(videoPath: string): Promise<number> {
//   // Extract the duration of the video
//   return new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(videoPath, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         // Convert the duration string to a number
//         const duration = Number(data.format.duration);
//         resolve(duration);
//       }
//     });
//   });
// }
