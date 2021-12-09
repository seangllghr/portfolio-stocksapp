export interface Match {
  symbol: string,
  name: string,
  region: string,
  currency: string,
  matchScore: number
}

export interface SearchResults {
  success: boolean,
  reason?: string,
  matches?: Match[]
}
