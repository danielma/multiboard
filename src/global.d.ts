type TrelloSuccess = any;
type TrelloFailure = JQueryXHR;

interface TrelloClient {
  authorize: (options: object) => void;

  get: (
    path: string,
    params: object,
    success: (json: TrelloSuccess) => void,
    error?: (jqXhr: TrelloFailure) => void
  ) => void;
}

type TrelloBoard = {
  readonly name: string;
  readonly id: string;
  readonly prefs: {
    backgroundColor?: string;
    backgroundBottomColor?: string;
    backgroundTopColor?: string;
    backgroundBrightness: 'dark' | 'light';
  };
};

interface ITrelloAPIList {
  readonly id: string;
  readonly name: string;
}

type OptionalListConfig = {
  showLastComment: boolean;
  showCardTitle: boolean;
  sort: 'lastAction' | 'lastModified' | 'position';
  display: 'normal' | 'wide';
};

type ListConfig = OptionalListConfig & {
  name: string;
};

type TrelloMultiList = {
  name: string;
  lists: ITrelloList[];
  config: ListConfig;
};

interface ITrelloList extends ITrelloAPIList {
  readonly board: TrelloBoard;
  readonly config: ListConfig;
}

interface ITrelloAction {
  type: string;
  date: string;
}

type ITrelloAPICard = {
  readonly id: string;
  readonly name: string;
  readonly pos: number;
  readonly dateLastActivity: string;
  readonly idMembers: string[];
  readonly url: string;
  readonly subscribed: boolean;

  readonly labels: ITrelloLabel[];

  readonly members: ITrelloMember[];

  readonly actions?: ITrelloAction[];
};

type ITrelloCard = ITrelloAPICard & {
  readonly comments: ITrelloComment[];
  readonly list: ITrelloList;
  readonly board: TrelloBoard;
};

interface ITrelloComment extends ITrelloAction {
  readonly type: 'commentCard';

  readonly id: string;
  readonly data: {
    text: string;
  };
}

type TrelloLabelColor =
  | 'red'
  | 'orange'
  | 'pink'
  | 'black'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'blue'
  | 'lime';

type ITrelloLabel = {
  id: string;
  color: TrelloLabelColor;
  name: string;
};

type ITrelloMember = {
  id: string;

  avatarHash: string;
  avatarUrl: string;
};
