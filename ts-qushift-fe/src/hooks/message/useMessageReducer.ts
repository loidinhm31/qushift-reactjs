export const initialState = {
	selectedId: "",
	message: ""
};

export function useMessageReducer(state, action) {
	switch (action.type) {
		case "changed_selection": {
			return {
				...state,
				selectedId: action.topicId,
				message: ""
			};
		}
		case "edited_message": {
			return {
				...state,
				message: action.message
			};
		}
		case "sent_message": {
			return {
				...state,
				message: ""
			};
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}