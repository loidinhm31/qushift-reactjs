interface State {
  selectedId: string;
  message: string;
}

interface ChangedSelectionAction {
  type: "changed_selection";
  topicId: string;
}

interface EditedMessageAction {
  type: "edited_message";
  message: string;
}

interface SentMessageAction {
  type: "sent_message";
}

export type Action = ChangedSelectionAction | EditedMessageAction | SentMessageAction;

export const initialState: State = {
  selectedId: "",
  message: "",
};

export function useMessageReducer(state: State, action: Action): State {
  switch (action.type) {
    case "changed_selection": {
      return {
        ...state,
        selectedId: action.topicId,
        message: "",
      };
    }
    case "edited_message": {
      return {
        ...state,
        message: action.message,
      };
    }
    case "sent_message": {
      return {
        ...state,
        message: "",
      };
    }
    default: {
      throw new Error("Unknown action: " + action);
    }
  }
}
