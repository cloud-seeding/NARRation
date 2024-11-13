// app/types/index.ts
export interface NARRData {
  metadata: {
    created: string;
    base_path: string;
    variables_processed: string[];
  };
  variables: {
    [key: string]: Record<
      string,
      {
        missing_count?: number;
        total_points?: number;
        missing_percentage?: number;
      }
    >;
  };
  daily_summary: Record<
    string,
    {
      total_missing: number;
      variables_affected: string[];
      max_percentage: number;
    }
  >;
}
