import localforage from 'localforage';

const DB_NAME = 'gitlab_search_db';
const STORE_NAME = 'gitlab_search_store';

// 初始化 localforage 实例
const storage = localforage.createInstance({
  name: DB_NAME,
  storeName: STORE_NAME,
});

// 辅助函数：生成带 token 前缀的键
const getKeyWithToken = (key: string, token: string) => {
  return `${token}_${key}`;
};

interface StorageItem<T> {
  value: T;
  token: string;
}

/**
 * 从存储中获取数据
 * @param key 键名
 * @param currentToken 当前的 token
 * @returns Promise<T | null>
 */
export const getItem = async <T>(
  key: string,
  currentToken: string,
): Promise<T | null> => {
  if (!currentToken) return null; // 如果没有 token，不读取数据
  const fullKey = getKeyWithToken(key, currentToken);
  const item = await storage.getItem<StorageItem<T>>(fullKey);
  return item ? item.value : null;
};

/**
 * 将数据存储到存储中
 * @param key 键名
 * @param value 值
 * @param currentToken 当前的 token
 * @returns Promise<void>
 */
export const setItem = async <T>(
  key: string,
  value: T,
  currentToken: string,
): Promise<void> => {
  if (!currentToken) return; // 如果没有 token，不存储数据
  const fullKey = getKeyWithToken(key, currentToken);
  const item: StorageItem<T> = { value, token: currentToken };
  await storage.setItem(fullKey, item);
};

/**
 * 清理旧的或不相关的 token 缓存
 * @param currentToken 当前正在使用的 token
 * @returns Promise<void>
 */
export const clearOldTokens = async (currentToken: string): Promise<void> => {
  const keys = await storage.keys();
  const keysToDelete = keys.filter((key) => {
    // 检查键是否以某个 token 开头，并且不是当前 token 的键
    const parts = key.split('_');
    if (parts.length > 1) {
      const storedToken = parts[0];
      return storedToken !== currentToken;
    }
    return false;
  });

  await Promise.all(keysToDelete.map((key) => storage.removeItem(key)));
  console.log(`Cleared ${keysToDelete.length} old token caches.`);
};

/**
 * 清理所有缓存 (慎用)
 * @returns Promise<void>
 */
export const clearAll = async (): Promise<void> => {
  await storage.clear();
  console.log('All caches cleared.');
};
