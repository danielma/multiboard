import source from './config.json';

type AppConfig = {
  readonly boards: string[];
  readonly lists: ListConfig[];
  readonly members: string[];

  readonly name: string;
  readonly useTrelloApp: boolean;
};

const listDefaults: OptionalListConfig = {
  showLastComment: false,
  showCardTitle: true,
  sort: 'lastModified',
  display: 'normal',
};

let appConfig: AppConfig = {
  boards: source.boards,
  lists: source.lists.map((list) => {
    if (typeof list === 'string') {
      return { name: list, ...listDefaults };
    } else {
      const sort = list.sort as ListConfig['sort'];
      const display = list.display as ListConfig['display'];
      return { ...listDefaults, ...list, sort, display };
    }
  }),
  members: source.members,

  name: source.name,
  useTrelloApp: source.useTrelloApp,
};

export default appConfig;
