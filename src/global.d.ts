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
    backgroundColor: string;
  };
};

type TrelloList = {
  readonly id: string;
  readonly name: string;
};
