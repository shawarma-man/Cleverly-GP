// duration.ts

import * as ffmpeg from 'fluent-ffmpeg';
import getDuration from 'get-video-duration';
import bufferToStream from 'buffer-to-stream';


export async function getDurationFromBuffer(buffer: Buffer): Promise<String> {
  const durationInSeconds = await getDuration(bufferToStream(buffer));
  const duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);
  return duration;
}
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