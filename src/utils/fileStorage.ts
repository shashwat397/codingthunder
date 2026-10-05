/**
 * Persistent Client-Side File Storage for Digital Ebook Assets using IndexedDB
 * Allows storing full-size PDF, ePub, and ZIP files directly in the browser with no size limit.
 */

const DB_NAME = 'codingthunder_file_vault';
const STORE_NAME = 'ebook_assets';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openVaultDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('ebookId', 'ebookId', { unique: false });
        store.createIndex('fileName', 'fileName', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open file vault IndexedDB'));
    };
  });

  return dbPromise;
}

export interface StoredEbookFile {
  key: string;
  ebookId: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  sizeBytes: number;
  uploadedAt: string;
}

/**
 * Saves the exact original uploaded file into IndexedDB
 */
export async function saveOriginalEbookFile(
  ebookId: string,
  file: File | Blob,
  fileName: string,
  mimeType = 'application/pdf',
  ebookSlug?: string
): Promise<boolean> {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredEbookFile = {
      key: ebookId,
      ebookId,
      fileName,
      mimeType: mimeType || (file instanceof File ? file.type : 'application/pdf'),
      blob: file,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };

    store.put(record);

    // Also store by filename for fallback lookup
    if (fileName) {
      store.put({ ...record, key: `name_${fileName.toLowerCase()}` });
    }

    // Also store by slug if provided
    if (ebookSlug) {
      store.put({ ...record, key: `slug_${ebookSlug.toLowerCase()}` });
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed to store ebook file in IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieves the exact original uploaded file from IndexedDB
 */
export async function getOriginalEbookFile(
  identifier: string
): Promise<StoredEbookFile | null> {
  if (!identifier) return null;
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    // Try direct key
    let result = await getRecordByKey(store, identifier);
    if (result && result.blob) return result;

    // Try slug key
    result = await getRecordByKey(store, `slug_${identifier.toLowerCase()}`);
    if (result && result.blob) return result;

    // Try filename key
    result = await getRecordByKey(store, `name_${identifier.toLowerCase()}`);
    if (result && result.blob) return result;

    return null;
  } catch (err) {
    console.warn('Failed to retrieve ebook file from IndexedDB:', err);
    return null;
  }
}

function getRecordByKey(store: IDBObjectStore, key: string): Promise<StoredEbookFile | null> {
  return new Promise((resolve) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}
