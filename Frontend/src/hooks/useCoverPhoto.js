import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useCoverPhoto () {
	const { api } = constants()
	
	async function upload (formData) {
		try {
			let response = await axios.post(
				api + "/uploadCoverPhoto",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { upload }
}

export default useCoverPhoto