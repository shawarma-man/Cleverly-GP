import config from "config";
import storage from "../../config/storage";

const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
const client = new VideoIntelligenceServiceClient({
    keyFilename: 'cleverly-372120-69762213ac56.json'
});

export async function generateAndUploadThumbnail(videoUrl: string, fileName: string): Promise<string> {
    const request = {
        inputUri: videoUrl,
        features: ['SHOT_CHANGE_DETECTION'],
    };

    const [operation] = await client.annotateVideo(request);
    const [response] = await operation.promise();

    const thumbnail = response.annotationResults[0].shotAnnotations[0].thumbnail;
    const thumbnailBuffer = Buffer.from(thumbnail, 'base64');

    const bucket = storage.bucket('cleverly_videos');
    const blob = bucket.file(`${fileName}_thumbnail.jpg`);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });
    blobStream.end(thumbnailBuffer);
    const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
    });
    return url;
}
