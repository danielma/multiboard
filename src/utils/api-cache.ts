import store from 'store2';
import { Either, Success } from '../results';

type RequestOptions = { forceRehydrate?: boolean };

const CACHE_VERSION = 1;

function generateCacheKey(root: string) {
  return ['cached-request', CACHE_VERSION, root].join('-');
}

export function clearCache() {
  const keyStart = generateCacheKey('');

  store
    .keys()
    .filter((key) => key.startsWith(keyStart))
    .forEach((key) => {
      store.remove(key);
    });
}

export async function request<SuccessType, FailureType = any>(
  makeRequest: () => Promise<Either<SuccessType, FailureType>>,
  cacheKey: string,
  options: RequestOptions = {
    forceRehydrate: false,
  }
): Promise<Either<SuccessType, FailureType>> {
  const fullCacheKey = generateCacheKey(cacheKey);

  const rehydrate = Object.prototype.hasOwnProperty.call(
    options,
    'forceRehydrate'
  )
    ? options.forceRehydrate
    : false;

  if (store.has(fullCacheKey) && rehydrate === false) {
    console.log('Cache hit for: ', fullCacheKey, store.get(fullCacheKey));
    return Success.from(store.get(fullCacheKey));
  } else {
    const response = await makeRequest();

    response.flatMap((value) => {
      store.set(fullCacheKey, value);
    });

    return response;
  }
}
