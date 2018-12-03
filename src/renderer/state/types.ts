import { AxiosInstance } from "axios";
import { AnyAction } from "redux";

import { DeckStateBranch } from "./deck/types";
import { FeedbackStateBranch } from "./feedback/types";
import { MetadataStateBranch } from "./metadata/types";
import { PageStateBranch } from "./page/types";
import { SelectionStateBranch } from "./selection/types";

export interface ActionDescription {
    accepts: (action: AnyAction) => boolean;
    perform: (state: any, action: any) => any;
}

export interface BatchedAction {
    type: string;
    batch: boolean;
    payload: AnyAction[];
}

export interface ReduxLogicDeps {
    action: AnyAction;
    baseApiUrl: string;
    httpClient: AxiosInstance;
    getState: () => State;
    ctx?: any;
}

export type ReduxLogicNextCb = (action: AnyAction) => void;
export type ReduxLogicDoneCb = () => void;

export interface State {
    deck: DeckStateBranch;
    feedback: FeedbackStateBranch;
    metadata: MetadataStateBranch;
    page: PageStateBranch;
    selection: SelectionStateBranch;
}

export interface TypeToDescriptionMap {
    [propName: string ]: ActionDescription;
}
