import axios from "axios"
import constants from "../constants/constants"

const hooks = {
	api: constants().api,

	async sendMessage(_id, base64Data, b64encodedIv, form) {
		try {
			const formData = new FormData(form)
			formData.append("_id", _id)
			formData.append("messageEncrypted", base64Data)
			formData.append("iv", b64encodedIv)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/sendMessage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async getKeys(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/getKeys",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async getFriendsChat(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/getFriendsChat",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async toggleJoinGroup(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/toggleJoinGroup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async toggleLikePage(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/toggleLikePage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async sendFriendRequest(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/sendFriendRequest",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async acceptFriendRequest(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/acceptFriendRequest",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async unfriend(_id) {
		try {
			const formData = new FormData()
			formData.append("_id", _id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/unfriend",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},

	async search(query) {
		try {
			const formData = new FormData()
			formData.append("query", query)

			let response = await axios.post(
				this.api + "/search",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
		}
		return null
	},
}

export default hooks