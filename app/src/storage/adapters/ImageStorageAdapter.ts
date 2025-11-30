import RNFS from 'react-native-fs';
import { IImageStorage, ImageCategory } from '../interfaces/IStorage';

const IMAGES_DIR = `${RNFS.DocumentDirectoryPath}/images`;

export class ImageStorageAdapter implements IImageStorage {
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // Create directory structure
            await RNFS.mkdir(`${IMAGES_DIR}/house`);
            await RNFS.mkdir(`${IMAGES_DIR}/inventory`);
            await RNFS.mkdir(`${IMAGES_DIR}/person`);
            await RNFS.mkdir(`${IMAGES_DIR}/receipt`);
            await RNFS.mkdir(`${IMAGES_DIR}/temp`);

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize image storage:', error);
            throw error;
        }
    }

    async saveImage(
        key: string,
        sourceUri: string,
        category: ImageCategory
    ): Promise<string> {
        await this.initialize();

        const extension = sourceUri.split('.').pop() || 'jpg';
        const filename = `${key}.${extension}`;
        const destPath = `${IMAGES_DIR}/${category}/${filename}`;

        try {
            await RNFS.copyFile(sourceUri, destPath);
            return destPath;
        } catch (error) {
            console.error(`Failed to save image ${key}:`, error);
            throw error;
        }
    }

    async getImage(key: string): Promise<string | null> {
        await this.initialize();

        // Search in all categories
        const categories: ImageCategory[] = ['house', 'inventory', 'person', 'receipt'];

        for (const category of categories) {
            const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];

            for (const ext of possibleExtensions) {
                const path = `${IMAGES_DIR}/${category}/${key}.${ext}`;
                if (await RNFS.exists(path)) {
                    return path;
                }
            }
        }

        return null;
    }

    async deleteImage(key: string): Promise<void> {
        await this.initialize();

        const imagePath = await this.getImage(key);
        if (imagePath && await RNFS.exists(imagePath)) {
            await RNFS.unlink(imagePath);
        }
    }

    async getImageSize(key: string): Promise<number> {
        await this.initialize();

        const imagePath = await this.getImage(key);
        if (!imagePath) return 0;

        try {
            const stat = await RNFS.stat(imagePath);
            return stat.size;
        } catch (error) {
            console.error(`Failed to get image size for ${key}:`, error);
            return 0;
        }
    }

    async clearTempImages(): Promise<void> {
        await this.initialize();

        const tempDir = `${IMAGES_DIR}/temp`;
        try {
            const files = await RNFS.readDir(tempDir);
            await Promise.all(files.map(file => RNFS.unlink(file.path)));
        } catch (error) {
            console.error('Failed to clear temp images:', error);
        }
    }
}

// Singleton instance
export const imageStorage = new ImageStorageAdapter();
