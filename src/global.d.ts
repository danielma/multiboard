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
  name: string;
  id: string;
  prefs: {
    backgroundColor: string;
  };
};