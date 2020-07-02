export interface tagResponse {
  createdAt?: string;
  updatedAt?: string;
  value: string;
  // articles should be extended
  // to avoid circular dependency
}

export interface tag {
  createdAt: number;
  updatedAt: number;
  value: string;
}
