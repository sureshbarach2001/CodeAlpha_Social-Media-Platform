import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useLogin () {
	const { api } = constants()
	
	async function login (formData) {
		try {
			let response = await axios.post(
				api + "/login",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { login }
}

export default useLogin