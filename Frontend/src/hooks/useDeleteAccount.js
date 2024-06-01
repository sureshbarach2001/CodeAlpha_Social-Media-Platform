import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useDeleteAccount () {
	const { api } = constants()
	
	async function deleteAccount (formData) {
		try {
			let response = await axios.post(
				api + "/deleteAccount",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { deleteAccount }
}

export default useDeleteAccount