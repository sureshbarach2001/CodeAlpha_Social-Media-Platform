import axios from "axios"
import { useState } from "react"
import constants from "../constants/constants"

function useGetUser () {
	const { api } = constants()
	
	async function getUser () {
		try {
			const formData = new FormData()
			formData.append("accessToken", localStorage.getItem("accessToken"));

			let response = await axios.post(
				api + "/getUser",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { getUser }
}

export default useGetUser