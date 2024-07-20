import video1 from '../../assets/video-1.mp4';
import video2 from '../../assets/video-2.mp4';
import video3 from '../../assets/video-3.mp4';
import video4 from '../../assets/video-4.mp4';
import video5 from '../../assets/video-5.mp4';

import videoThumbnail1 from '../../assets/video-thumbnail-1.jpeg';
import videoThumbnail2 from '../../assets/video-thumbnail-2.jpeg';
import videoThumbnail3 from '../../assets/video-thumbnail-3.jpeg';
import videoThumbnail4 from '../../assets/video-thumbnail-4.jpeg';
import videoThumbnail5 from '../../assets/video-thumbnail-5.jpeg';

export interface IMaterial {
  id: string;
  width: number;
  height: number;
  name: string;
  duration: number;
  url: string;
  thumbnail: string;
}

export const materials: IMaterial[] = [
  {
    id: '1',
    width: 1280,
    height: 720,
    name: '大气火焰粒子爆炸开场片头转场',
    duration: 7133,
    url: video1,
    thumbnail: videoThumbnail1,
  },
  {
    id: '2',
    width: 1080,
    height: 1080,
    name: '啊？',
    duration: 7233,
    url: video2,
    thumbnail: videoThumbnail2,
  },
  {
    id: '3',
    width: 480,
    height: 480,
    name: '搞笑片段转场黑人哭泣',
    duration: 7799,
    url: video3,
    thumbnail: videoThumbnail3,
  },
  {
    id: '4',
    width: 1920,
    height: 1000,
    name: '沈腾不装了',
    duration: 12600,
    url: video4,
    thumbnail: videoThumbnail4,
  },
  {
    id: '5',
    width: 1080,
    height: 1080,
    name: '女子魔性笑声',
    duration: 2133,
    url: video5,
    thumbnail: videoThumbnail5,
  },
];
