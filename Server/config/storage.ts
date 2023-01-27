import { Storage } from '@google-cloud/storage';

// Provide the path to your JSON credentials file
const storage = new Storage({
  keyFilename: 'cleverly-372120-69762213ac56.json'
});

export default storage;