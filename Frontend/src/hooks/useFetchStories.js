import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useFetchStories () {
	const { api } = constants()
	
	async function fetchStories (formData) {
		try {
			let response = await axios.post(
				api + "/getStories",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { fetchStories }
}

export default useFetchStories