export interface FivetranRequest {
  agent: string;
  state?: {
    cursor: string;
  };
  secrets?: {
    [k: string]: string;
  };
  setup_test?: boolean;
}

export interface FivetranResponse {
  state?: {
    [cursorName: string]: string | number;
  };
  insert?: {
    [tableName: string]: any[];
  };
  delete?: {
    [tableName: string]: any[];
  };
  schema?: {
    [tableName: string]: {
      primary_key: string[];
    };
  };
  hasMore: boolean;
}
