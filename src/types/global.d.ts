declare global {
  interface Window {
    spark: {
      kv: {
        keys: () => Promise<string[]>;
        get: <T>(key: string) => Promise<T | undefined>;
        set: <T>(key: string, value: T) => Promise<void>;
        delete: (key: string) => Promise<void>;
      };
    };
  }
  
  const spark: {
    kv: {
      keys: () => Promise<string[]>;
      get: <T>(key: string) => Promise<T | undefined>;
      set: <T>(key: string, value: T) => Promise<void>;
      delete: (key: string) => Promise<void>;
    };
  };
}

export {};