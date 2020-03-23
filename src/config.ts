import source from './config.json';

type AppConfig = {
  readonly boards: string[];
  readonly lists: ListConfig[];
  readonly members: string[];

  readonly useTrelloApp: boolean;
};

let appConfig: AppConfig = {
  boards: source.boards,
  lists: source.lists.map((list) => {
    return typeof list === 'string'
      ? { name: list, showLastComment: false, showCardTitle: true }
      : list;
  }),
  members: source.members,

  useTrelloApp: source.useTrelloApp,
};

export default appConfig;
