
export const getMediaUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined;

    // If it's already a full URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a relative path starting with /, prepend the API base URL
    // access env variable directly as axios.ts does
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    // The API_URL usually points to /api, but static files are at root /uploads
    // So we need to extract the origin

    try {
        const urlObj = new URL(apiUrl);
        const origin = urlObj.origin; // http://localhost:8000

        if (path.startsWith('/')) {
            return `${origin}${path}`;
        }

        return `${origin}/${path}`;
    } catch (e) {
        // Fallback for invalid URL
        return path;
    }
};
