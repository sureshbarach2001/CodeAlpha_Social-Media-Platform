import axios from "axios"
import constants from "../constants/constants"

const useGroup = {
	api: constants().api,

	async destroy(formData) {
		try {
			let response = await axios.post(
				this.api + "/deleteGroup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async update(formData) {
		try {
			let response = await axios.post(
				this.api + "/editGroup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async fetchSingle(formData) {
		try {
			let response = await axios.post(
				this.api + "/getGroupDetail",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async toggleJoin(formData) {
		try {
			let response = await axios.post(
				this.api + "/toggleJoinGroup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async fetch(formData) {
		try {
			let response = await axios.post(
				this.api + "/getGroups",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async create(formData) {
		try {
			let response = await axios.post(
				this.api + "/createGroup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}
}

export default useGroup