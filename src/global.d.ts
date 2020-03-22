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

type TrelloBoard = ReadOnly<{
  name: string;
  id: string;
  prefs: {
    backgroundColor: string;
  };
}>;

type TrelloList = ReadOnly<{
  id: string;
  name: string;
}>;
