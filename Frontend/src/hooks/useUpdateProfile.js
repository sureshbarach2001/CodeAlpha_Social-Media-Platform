import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useUpdateProfile () {
	const { api } = constants()
	
	async function updateProfile (formData) {
		try {
			let response = await axios.post(
				api + "/updateProfile",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { updateProfile }
}

export default useUpdateProfile