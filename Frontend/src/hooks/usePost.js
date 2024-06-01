import axios from "axios"
import constants from "../constants/constants"

function usePost () {
	const { api } = constants()

	async function fetchPostSharers (formData) {
		try {
			let response = await axios.post(
				api + "/fetchPostSharers",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function deletePost (formData) {
		try {
			let response = await axios.post(
				api + "/deletePost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function fetchPost (formData) {
		try {
			let response = await axios.post(
				api + "/fetchPost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function sharePost (formData) {
		try {
			let response = await axios.post(
				api + "/sharePost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function postComment (formData) {
		try {
			let response = await axios.post(
				api + "/postComment",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function fetchCommentsByPost (formData) {
		try {
			let response = await axios.post(
				api + "/fetchCommentsByPost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function fetchPostDisLikers (formData) {
		try {
			let response = await axios.post(
				api + "/fetchPostDisLikers",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function toggleDislikePost (formData) {
		try {
			let response = await axios.post(
				api + "/toggleDislikePost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function fetchPostLikers (formData) {
		try {
			let response = await axios.post(
				api + "/fetchPostLikers",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function toggleLikePost (formData) {
		try {
			let response = await axios.post(
				api + "/toggleLikePost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function getNewsfeed (formData) {
		try {
			let response = await axios.post(
				api + "/getNewsfeed",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}
	
	async function addPost (formData) {
		try {
			let response = await axios.post(
				api + "/addPost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { fetchPostSharers, deletePost, fetchPost, sharePost, addPost, getNewsfeed, toggleLikePost, fetchPostLikers, toggleDislikePost, fetchPostDisLikers, fetchCommentsByPost, postComment }
}

export default usePost