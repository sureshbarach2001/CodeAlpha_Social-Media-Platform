import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useLogout () {
	const { api } = constants()
	
	async function doLogout () {
		try {
			const formData = new FormData()
			formData.append("accessToken", localStorage.getItem("accessToken"));

			let response = await axios.post(
				api + "/logout",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { doLogout }
}

export default useLogout