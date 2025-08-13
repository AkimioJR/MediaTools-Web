export interface MediaItem {
  title: string; // 标题
  original_title: string; // 原始标题
  year: number; // 年份
  media_type: "Movie" | "TV"; // 电影、电视剧
  part: string; // 分段

  file_extension: string; // 文件扩展名

  // ID 信息
  tmdb_id: number; // TMDB ID
  imdb_id: string; // IMDb ID
  tvdb_id: number; // TVDB ID

  // 资源相关信息
  customization: string[]; // 自定义词
  release_groups: string[]; // 发布组
  version: number; // 版本号
  platform: string; // 流媒体平台
  resource_type: string; // 资源类型
  resource_effect: string[]; // 资源效果
  resource_pix: string; // 分辨率
  video_encode: string; // 视频编码
  audio_encode: string; // 音频编码

  // 电视剧数据
  season: number; // 季数 -1表示无季数
  season_str: string; // 季 S01 S01-S03
  season_year: number; // 季年份
  episode: number; // 集数 -1表示无集数
  episode_str: string; // 集 E12 E12-E15
  episode_title: string; // 集标题
  episode_date: string; // 集发布日期
}

export interface RecognizeMediaResponse {
  item: MediaItem; // 识别的媒体信息
  custom_rule: string; // 匹配的自定义规则
  meta_rule: string; // 应用的媒体规则
}
