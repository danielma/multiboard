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
  };
};

type TrelloList = {
  readonly id: string;
  readonly name: string;

  readonly board: TrelloBoard;
};

type ITrelloCard = {
  readonly id: string;
  readonly name: string;
  readonly pos: number;
  readonly dateLastActivity: string;
  readonly idMembers: string[];
  readonly url: string;

  readonly board: TrelloBoard;
};

type ITrelloMember = {
  id: string;

  avatarHash: string;
  avatarUrl: string;
};
