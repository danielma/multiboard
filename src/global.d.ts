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

type ListConfig = {
  name: string;

  showLastComment: boolean;
  showCardTitle: boolean;
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

  readonly labels: ITrelloLabel[];

  readonly members: ITrelloMember[];

  readonly actions: ITrelloAction[];
};

type ITrelloCard = ITrelloAPICard & {
  readonly comments: ITrelloComment[];
  readonly list: ITrelloList;
  readonly board: TrelloBoard;
};

/*
  {
  "id": "5e7919e7eb41ae3d024125e7",
  "idMemberCreator": "53c96030b0efecbd0d185d6d",
  "data": {
    "text": "I just need to know what happens if there is another comment",
    "card": {
      "id": "5e79081649212477009f1003",
      "name": "DMa",
      "idShort": 1,
      "shortLink": "nkkALWyn"
    },
    "board": {
      "id": "5e790768273c6f7a15acc990",
      "name": "Giving Team PowWow",
      "shortLink": "OC17VgQN"
    },
    "list": {
      "id": "5e7907854c45a45adb9ba6fa",
      "name": "Today's PowWow"
    }
  },
  "type": "commentCard",
  "date": "2020-03-23T20:19:51.576Z",
  "limits": {
    "reactions": {
      "perAction": {
        "status": "ok",
        "disableAt": 1000,
        "warnAt": 900
      },
      "uniquePerAction": {
        "status": "ok",
        "disableAt": 17,
        "warnAt": 16
      }
    }
  },
  "memberCreator": {
    "id": "53c96030b0efecbd0d185d6d",
    "activityBlocked": false,
    "avatarHash": "18d666b157faa8998c1319f0cacef802",
    "avatarUrl": "https://trello-members.s3.amazonaws.com/53c96030b0efecbd0d185d6d/18d666b157faa8998c1319f0cacef802",
    "fullName": "danielma",
    "idMemberReferrer": null,
    "initials": "D",
    "nonPublic": {},
    "nonPublicAvailable": true,
    "username": "danielhgma"
  }
}
*/

interface ITrelloComment extends ITrelloAction {
  readonly type: 'commentCard';

  readonly id: string;
  readonly data: {
    text: string;
  };
}

type TrelloLabelColor =
  | 'red'
  | 'pink'
  | 'black'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'blue';

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
