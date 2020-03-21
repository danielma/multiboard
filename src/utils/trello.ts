import config from '../config.json';
import store from 'store2';
import { Either, Success, Failure } from '../results';

function get(
  path: string,
  params: object = {}
): Promise<Either<TrelloSuccess, TrelloFailure>> {
  return new Promise((resolve) => {
    window.Trello.get(
      path,
      params,
      (json) => resolve(new Success(json)),
      (jqXhr) => resolve(new Failure(jqXhr))
    );
  });
}

async function cachedGet(
  cacheKey: string,
  path: string
): Promise<Either<TrelloSuccess, TrelloFailure>> {
  if (store.has(cacheKey)) {
    console.log('Cache hit for: ', cacheKey);
    return Success.from(store.get(cacheKey));
  } else {
    const response = await get(path);

    response.bind((value) => {
      store.set(cacheKey, value);
    });

    return response;
  }
}

export async function getBoards(): Promise<
  Either<TrelloBoard[], TrelloFailure>
> {
  const boards: Either<TrelloBoard[], TrelloFailure> = await cachedGet(
    config.boards.sort().join('-'),
    'members/me/boards'
  );

  return boards.flatMap((boards) =>
    boards.filter((b) => config.boards.includes(b.name))
  );
}
