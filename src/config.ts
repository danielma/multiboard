import source from './config.json';

type AppConfig = {
  readonly boards: string[];
  readonly lists: ListConfig[];
  readonly members: string[];

  readonly useTrelloApp: boolean;
};

const listDefaults: OptionalListConfig = {
  showLastComment: false,
  showCardTitle: true,
  sort: 'lastModified',
};

let appConfig: AppConfig = {
  boards: source.boards,
  lists: source.lists.map((list) => {
    if (typeof list === 'string') {
      return { name: list, ...listDefaults };
    } else {
      const sort = list.sort as ListConfig['sort'];
      return { ...listDefaults, ...list, sort };
    }
  }),
  members: source.members,

  useTrelloApp: source.useTrelloApp,
};

export default appConfig;
