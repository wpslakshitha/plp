import sharp from 'sharp';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function addWatermarkAndUpload(imageUrl: string): Promise<string> {
    try {
        // 1. Download the image from the URL
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer'
        });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // 2. Create watermark text SVG
        const watermarkText = 'RealEstate ©';
        const svgWatermark = `
            <svg width="400" height="100">
                <text x="10" y="50" font-family="Arial" font-size="32" fill="white" fill-opacity="0.5">${watermarkText}</text>
            </svg>
        `;
        const watermarkBuffer = Buffer.from(svgWatermark);

        // 3. Composite the watermark onto the image using Sharp
        const watermarkedBuffer = await sharp(imageBuffer)
            .composite([{
                input: watermarkBuffer,
                gravity: 'southeast', // Position watermark at the bottom-right
            }])
            .toBuffer();

        // 4. Upload the watermarked buffer to Cloudinary
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "watermarked_properties" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result!.secure_url);
                }
            );
            uploadStream.end(watermarkedBuffer);
        });

    } catch (error) {
        console.error("Error in watermarking process:", error);
        // If watermarking fails, return the original URL as a fallback
        return imageUrl;
    }
}