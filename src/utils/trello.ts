import config from '../config';
import { request } from './api-cache';
import { Either, Success, Failure } from '../results';

type TrelloResponse<T> = Promise<Either<T, TrelloFailure>>;
const TrelloResponse = Promise;

type GetOptions = {
  params?: object;
};

function get<T>(path: string, options: GetOptions = {}): TrelloResponse<T> {
  return new Promise((resolve) => {
    window.Trello.get(
      path,
      options.params || {},
      (json) => resolve(new Success(json)),
      (jqXhr) => resolve(new Failure(jqXhr))
    );
  });
}

type CachedGetOptions = GetOptions & {
  cacheKey?: string;
  forceRehydrate?: boolean;
};

async function cachedGet<T extends TrelloSuccess>(
  path: string,
  options: CachedGetOptions = {
    forceRehydrate: false,
  }
): Promise<Either<T, TrelloFailure>> {
  const cacheKey = [
    path,
    JSON.stringify(options.params),
    options.cacheKey,
  ].join('-');

  return request(() => get(path, options), cacheKey);
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
): TrelloResponse<ITrelloList[]> {
  const configListNames = config.lists.map((l) => l.name);

  return cachedGet<ITrelloAPIList[]>(`boards/${board.id}/lists`, {
    params: { filter: 'open', cards: 'none', fields: 'id,name' },
    cacheKey: configListNames.sort().join('-'),
  }).then((lists) =>
    lists.flatMap((lists) =>
      lists
        .filter((b) => configListNames.includes(b.name))
        .map((l) => ({
          ...l,
          board,
          config: config.lists.find((cl) => cl.name === l.name)!,
        }))
    )
  );
}

export async function getCards(
  list: ITrelloList
): TrelloResponse<ITrelloCard[]> {
  const listConfig = config.lists.find((l) => l.name === list.name)!;

  return get<ITrelloAPICard[]>(`lists/${list.id}/cards`, {
    params: {
      members: true,
      actions: listConfig.showLastComment ? 'commentCard' : '',
    },
  }).then((cards) =>
    cards.flatMap((cards) =>
      cards.map((c) => {
        const comments = (c.actions || []).filter(
          (a) => a.type === 'commentCard'
        ) as ITrelloComment[];

        return {
          ...c,
          list,
          board: list.board,
          comments: comments,
        };
      })
    )
  );
}

export async function getMembers(): TrelloResponse<ITrelloMember[]> {
  const responses = await Promise.all(
    config.members.map((id) => cachedGet<ITrelloMember>(`members/${id}`))
  );

  const anyFailure = responses.find((r) => r.isFailure());

  if (anyFailure) {
    return anyFailure.failure();
  } else {
    return Success.from(responses.map((r) => r.forcedValue()));
  }
}
