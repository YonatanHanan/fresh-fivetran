export interface FreshBaseRequest {
  per_page: number;
  items_per_page: number;
  sort_order: 'asc' | 'desc';
  page: number;
}

export interface FreshBaseResponse {
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;

    total_count: number;
    current: number;
  };
  [k: string]: any;
}
