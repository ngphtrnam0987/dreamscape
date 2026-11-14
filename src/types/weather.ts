export type WeatherType =
  | 'scene-default'
  | 'clear'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'autumn-wind'
  | 'aurora';

export interface WeatherInfo {
  id: WeatherType;
  name: string;
  nameVi: string;
  desc: string;
  descVi: string;
  icon: string;
  accentColor: string;
  suggestedChannels: Array<{ id: string; volume: number }>;
}

export const WEATHER_TYPES_INFO: WeatherInfo[] = [
  {
    id: 'scene-default',
    name: 'Scene Default',
    nameVi: 'Mặc Định Theo Cảnh',
    desc: 'Original ambient weather tuned specifically for current scene',
    descVi: 'Thời tiết nguyên bản được thiết kế riêng cho từng bối cảnh',
    icon: 'Sparkles',
    accentColor: '#38bdf8',
    suggestedChannels: [],
  },
  {
    id: 'clear',
    name: 'Golden Sun & Motes',
    nameVi: 'Nắng Ấm & Bụi Sáng',
    desc: 'Gentle golden sunbeams, floating light motes, and warm amber daylight',
    descVi: 'Tia nắng ấm áp, bụi sáng lơ lửng và ánh sáng ban ngày rạng rỡ',
    icon: 'Sun',
    accentColor: '#f59e0b',
    suggestedChannels: [{ id: 'birds', volume: 0.4 }, { id: 'wind', volume: 0.25 }],
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    nameVi: 'Mưa Rào Êm Dịu',
    desc: 'Soft continuous translucent rain streaks and soothing window splashes',
    descVi: 'Những giọt mưa rơi êm đềm, vệt nước trôi nhẹ trên mặt kính',
    icon: 'CloudRain',
    accentColor: '#0ea5e9',
    suggestedChannels: [{ id: 'rain', volume: 0.7 }, { id: 'wind', volume: 0.3 }],
  },
  {
    id: 'thunderstorm',
    name: 'Dramatic Thunderstorm',
    nameVi: 'Giông Bão Sấm Sét',
    desc: 'Heavy wind-driven rain squalls and cinematic lightning illumination',
    descVi: 'Mưa nặng hạt giông bão kèm những vệt chớp sáng rực rỡ chân thực',
    icon: 'CloudLightning',
    accentColor: '#818cf8',
    suggestedChannels: [{ id: 'rain', volume: 0.85 }, { id: 'thunder', volume: 0.65 }, { id: 'wind', volume: 0.5 }],
  },
  {
    id: 'snow',
    name: 'Peaceful Snowfall',
    nameVi: 'Tuyết Rơi Mùa Đông',
    desc: 'Drifting hexagonal crystalline snowflakes and cool frosty atmospheric depth',
    descVi: 'Bông tuyết trắng muốt bay lượn chầm chậm trong không gian tĩnh mịch',
    icon: 'Snowflake',
    accentColor: '#a5f3fc',
    suggestedChannels: [{ id: 'wind', volume: 0.45 }],
  },
  {
    id: 'fog',
    name: 'Rolling Valley Mist',
    nameVi: 'Sương Mù Bảng Lảng',
    desc: 'Volumetric horizontal rolling fog curtains creating deep moody sanctuary',
    descVi: 'Những dải sương mù huyền ảo trôi bồng bềnh phủ kín không gian',
    icon: 'CloudFog',
    accentColor: '#cbd5e1',
    suggestedChannels: [{ id: 'wind', volume: 0.35 }],
  },
  {
    id: 'autumn-wind',
    name: 'Autumn Wind & Leaves',
    nameVi: 'Gió Thu Cuốn Lá Vàng',
    desc: 'Dynamic swirling wind trails carrying golden maple and amber foliage',
    descVi: 'Cơn gió thu xoáy nhẹ cuốn theo những chiếc lá vàng rơi xào xạc',
    icon: 'Wind',
    accentColor: '#fb923c',
    suggestedChannels: [{ id: 'wind', volume: 0.55 }, { id: 'forest', volume: 0.35 }],
  },
  {
    id: 'aurora',
    name: 'Cosmic Aurora Veil',
    nameVi: 'Cực Quang Huyền Diệu',
    desc: 'Shimmering celestial curtains of emerald, violet, and cyan northern lights',
    descVi: 'Dải cực quang huyền diệu chuyển động mềm mại trên bầu trời đêm',
    icon: 'Flame',
    accentColor: '#2dd4bf',
    suggestedChannels: [{ id: 'cosmic', volume: 0.5 }, { id: 'wind', volume: 0.3 }],
  },
];
