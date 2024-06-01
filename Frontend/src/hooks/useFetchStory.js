import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useFetchStory () {
	const { api } = constants()
	
	async function fetchStory (formData) {
		try {
			let response = await axios.post(
				api + "/getSingleStory",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { fetchStory }
}

export default useFetchStory