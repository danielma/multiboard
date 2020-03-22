import config from '../config.json';
import store from 'store2';
import { Either, Success, Failure } from '../results';

const CACHE_VERSION = 'v4';

type TrelloResponse<T> = Promise<Either<T, TrelloFailure>>;
const TrelloResponse = Promise;

function get(path: string, params: object = {}): TrelloResponse<TrelloSuccess> {
  return new Promise((resolve) => {
    window.Trello.get(
      path,
      params,
      (json) => resolve(new Success(json)),
      (jqXhr) => resolve(new Failure(jqXhr))
    );
  });
}

type CachedGetOptions = {
  cacheKey: string;
  params: object;
};

async function cachedGet<T extends TrelloSuccess>(
  path: string,
  options: CachedGetOptions = { params: {}, cacheKey: '' }
): Promise<Either<T, TrelloFailure>> {
  const fullCacheKey = [
    path,
    JSON.stringify(options.params),
    options.cacheKey,
    CACHE_VERSION,
  ].join('-');

  if (store.has(fullCacheKey)) {
    console.log('Cache hit for: ', fullCacheKey, store.get(fullCacheKey));
    return Success.from(store.get(fullCacheKey));
  } else {
    const response = await get(path, options.params);

    response.flatMap((value) => {
      store.set(fullCacheKey, value);
    });

    return response;
  }
}

export async function getBoards(): TrelloResponse<TrelloBoard[]> {
  return cachedGet<TrelloBoard[]>('members/me/boards', {
    params: { fields: 'id,name,prefs' },
    cacheKey: config.boards.sort().join('-'),
  }).then((boards) =>
    boards.flatMap((boards) =>
      boards.filter((b) => config.boards.includes(b.name))
    )
  );
}

export async function getLists(
  board: TrelloBoard
): TrelloResponse<TrelloList[]> {
  return cachedGet<TrelloList[]>(`boards/${board.id}/lists`, {
    params: { filter: 'open', cards: 'none', fields: 'id,name' },
    cacheKey: config.lists.sort().join('-'),
  }).then((lists) =>
    lists.flatMap((lists) =>
      lists
        .filter((b) => config.lists.includes(b.name))
        .map((l) => ({ ...l, board }))
    )
  );
}

export async function getCards(
  list: TrelloList
): TrelloResponse<ITrelloCard[]> {
  return cachedGet<ITrelloCard[]>(`lists/${list.id}/cards`).then((cards) =>
    cards.flatMap((cards) => cards.map((c) => ({ ...c, board: list.board })))
  );
}
