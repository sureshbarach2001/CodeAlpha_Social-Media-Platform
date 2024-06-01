import axios from "axios"
import constants from "../constants/constants"

const useBoost = {
	api: constants().api,

	async myAds() {
		try {
			const formData = new FormData()
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/fetchMyAds",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
		return null
	},

	async boostPost(budget, gender, whereToShow, _id, paymentId) {
		try {
			const formData = new FormData()
			formData.append("budget", budget)
			formData.append("gender", gender)
			formData.append("whereToShow", JSON.stringify(whereToShow))
			formData.append("_id", _id)
			formData.append("paymentId", paymentId)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/doBoostPost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async createStripeIntent(amount) {
		try {
			const formData = new FormData()
			formData.append("amount", amount)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/createStripeIntent",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	},

	async fetchPost(id) {
		try {
			const formData = new FormData()
			formData.append("_id", id)
			formData.append("accessToken", localStorage.getItem("accessToken"))

			let response = await axios.post(
				this.api + "/fetchPost",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}
}

export default useBoost