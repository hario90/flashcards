import {
    DESELECT_DECK,
    SELECT_DECK,
    SELECT_METADATA,
} from "./constants";
import {
    DeselectFileAction,
    SelectFileAction,
    SelectMetadataAction,
} from "./types";

export function selectFile(fileId: string | string[]): SelectFileAction {
    return {
        payload: fileId,
        type: SELECT_DECK,
    };
}

export function deselectFile(fileId: string | string[]): DeselectFileAction {
    return {
        payload: fileId,
        type: DESELECT_DECK,
    };
}

export function selectMetadata(key: string, payload: string | number): SelectMetadataAction  {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}
