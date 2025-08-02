export interface MediaItem {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'video';
    path: string;
    url?: string;
    createdAt: string;
    isFavorite?: boolean;
}

export const MOCK_DATA: MediaItem[] = [
    // Root level items
    {
        id: 'folder-1',
        name: 'Vacation 2023',
        type: 'folder',
        path: 'My Files',
        createdAt: '2023-10-15T10:00:00Z',
    },
    {
        id: 'image-1',
        name: 'sunset_beach.jpg',
        type: 'image',
        path: 'My Files',
        url: 'https://placehold.co/800x600.png',
        createdAt: '2023-08-20T18:30:00Z',
        isFavorite: true,
    },
    {
        id: 'video-1',
        name: 'mountain_hike.mp4',
        type: 'video',
        path: 'My Files',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        createdAt: '2023-09-05T14:15:00Z',
    },
    {
        id: 'image-2',
        name: 'city_skyline.png',
        type: 'image',
        path: 'My Files',
        url: 'https://placehold.co/800x600.png',
        createdAt: '2023-11-01T20:00:00Z',
    },
    {
        id: 'folder-2',
        name: 'Family Events',
        type: 'folder',
        path: 'My Files',
        createdAt: '2023-01-20T11:00:00Z',
    },

    // Items in "Vacation 2023"
    {
        id: 'image-3',
        name: 'beach_selfie.jpg',
        type: 'image',
        path: 'My Files/Vacation 2023',
        url: 'https://placehold.co/800x600.png',
        createdAt: '2023-08-21T11:45:00Z',
    },
    {
        id: 'image-4',
        name: 'local_market.jpg',
        type: 'image',
        path: 'My Files/Vacation 2023',
        url: 'https://placehold.co/800x600.png',
        createdAt: '2023-08-22T13:20:00Z',
        isFavorite: true,
    },
    {
        id: 'video-2',
        name: 'scuba_diving.mov',
        type: 'video',
        path: 'My Files/Vacation 2023',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        createdAt: '2023-08-23T09:00:00Z',
    },

    // Items in "Family Events"
     {
        id: 'folder-3',
        name: 'Birthdays',
        type: 'folder',
        path: 'My Files/Family Events',
        createdAt: '2023-01-20T11:00:00Z',
    },
    {
        id: 'image-5',
        name: 'new_year_2023.jpg',
        type: 'image',
        path: 'My Files/Family Events',
        url: 'https://placehold.co/800x600.png',
        createdAt: '2023-01-01T00:05:00Z',
    },
];
