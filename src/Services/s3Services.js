const s3Client = require('../Config/s3ClientConfig')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const removeFromSpaces = async (key) => {
    const params = {
        Bucket: process.env.DO_SPACES_BUCKET,  // Your DigitalOcean Space bucket
        Key: key,  // File key to delete
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`File ${key} successfully deleted from DigitalOcean Spaces`);
    } catch (err) {
        console.error('Error deleting file from Spaces:', err);
        throw new Error('Could not delete file from Spaces');
    }
};

module.exports = removeFromSpaces
