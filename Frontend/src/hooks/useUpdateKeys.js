import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useUpdateKeys () {
	const { api } = constants()
	
	async function updateKeys (email, publicKey, privateKey) {
		try {
			const formData = new FormData()
			formData.append("email", email)
			formData.append("publicKey", publicKey)
			formData.append("privateKey", privateKey)

			let response = await axios.post(
				api + "/updateKeys",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { updateKeys }
}

export default useUpdateKeys