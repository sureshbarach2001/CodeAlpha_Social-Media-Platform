import axios from "axios"
import constants from "../constants/constants"

function usePage () {
	const { api } = constants()

	async function deletePage (formData) {
		try {
			let response = await axios.post(
				api + "/deletePage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function editPage (formData) {
		try {
			let response = await axios.post(
				api + "/editPage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function toggleLikePage (formData) {
		try {
			let response = await axios.post(
				api + "/toggleLikePage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function getPageDetail (formData) {
		try {
			let response = await axios.post(
				api + "/getPageDetail",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	async function getPages (formData) {
		try {
			let response = await axios.post(
				api + "/getPages",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}
	
	async function createPage (formData) {
		try {
			let response = await axios.post(
				api + "/createPage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { deletePage, editPage, toggleLikePage, getPageDetail, getPages, createPage }
}

export default usePage