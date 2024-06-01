import { createStore } from "redux"

const initialState = {
	user: null,
	likers: [],
	dislikers: [],
	postComments: [],
	postSharers: []
}

const reducer = function (state = initialState, action) {
	if (action.type == "postSharers") {
		return {
			...state,
			postSharers: action.postSharers
		}
	}

	if (action.type == "updatePostComments") {
		return {
			...state,
			postComments: action.postComments
		}
	}

	if (action.type == "updateDisLikers") {
		return {
			...state,
			dislikers: action.dislikers
		}
	}

	if (action.type == "updateLikers") {
		return {
			...state,
			likers: action.likers
		}
	}

	if (action.type == "updateUser") {
		return {
			...state,
			user: action.user
		}
	}

	return state
}

const store = createStore(reducer)
export default store