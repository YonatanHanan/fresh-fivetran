export interface FivetranRequest {
  agent: string;
  state: {
    cursor: string;
  };
  secrets?: {
    [k: string]: string;
  };
}

export interface FivetranResponse {
  state?: {
    [cursorName: string]: string;
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
