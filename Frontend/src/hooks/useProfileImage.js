import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useProfileImage () {
	const { api } = constants()
	
	async function uploadProfileImage (formData) {
		try {
			let response = await axios.post(
				api + "/uploadProfileImage",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { uploadProfileImage }
}

export default useProfileImage