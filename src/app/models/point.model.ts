import { PointSupportLevels, PointTypesEnum } from './enums';

// Don't even think of making public properties Pascal Case

export class Point {

  pointID: number;
  voterIDPoint: number;
  isPointOwner: boolean;

  pointTypeID = PointTypesEnum.Opinion;
  pointTypeIDVoter: number;

  pointHTML: string;
  youTubeID: string;
  slashTags: string[] = [];

  draft: boolean;
  source: string;
  url: string;


  archived: boolean;

  // How many times am I going to attempt to make this a Date to use DateTime Pipe
  dateTimeUpdated: string;

  sequence: number;
  lastRowNumber: number;
  lastRow: boolean;

  pointFeedback = new PointFeedback();

  attached: boolean;

  adoptable: boolean;
  unadoptable: boolean;

  totalFeedback: number;
  netSupport: number;
  perCentInFavour: number;

  support: number;
  opposition: number;
  abstentions: number;
  reports: number;

  isInOpenedSurvey: boolean;
  isInClosedSurvey: boolean;
  isQuestionAnswer: boolean;
}

export class PointEdit {

  // However the user inputs them, pass them to the server to decode

  pointID: number;
  pointHTML: string;
  pointTypeID: PointTypesEnum;
  source: string;
  url: string;
  youTubeID: string;
  slashTags: string[] = [];
  draft: boolean;

}



// Always use camelCase properties
// https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Serialization_CamelCasePropertyNamesContractResolver.htm
export class PointSelectionResult {
  // My server and client code agreed these should be capitalised,
  // but after updating to VS Angular project, framework intervenes and insists lower case
  pointsSelected: number;
  fromDate: string;
  toDate: string;
  points: Point[];
}

export class PointFeedback {
  woWWeekEndingDate: Date; // Does not need to be formatted
  feedbackDate: string; // Date pipe eugh!
  feedbackGiven: boolean;
  feedbackID: number;
  supportLevelID: PointSupportLevels;
  woWVote: boolean;
  comment: string;
  feedbackIsUpdatable: boolean;
}

export class PointFeedbackFormData {
  pointID: number;
  pointSupportLevel: PointSupportLevels;
  comment: string;
  feedbackAnon: boolean;
}

export class PointWoWFormData {
  pointID: number;
  woW: boolean;
  feedbackAnon: boolean;
}

export class WoWWeekInfoVoteNotNeeded {
  woWWeekID: number;
  woWWeekEndingDate: Date; //  Does not need to be formatted
}
