// src/app/core/series/series.model.ts

export interface Season {
  seasonNumber: number;
  description: string;
  cast: string[];
  episodes: number;
}

export interface Series {
  id?: string;
  title: string;
  description: string;
  genre: string;
  seasons: Season[];
  posterUrl: string;
  releaseDate: Date;
  ageCategory: string;
}
