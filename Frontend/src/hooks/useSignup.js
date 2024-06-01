import axios from "axios"
import constants from "../constants/constants"

function useSignup () {
	const { api } = constants()
	
	async function signup (formData) {
		try {
			let response = await axios.post(
				api + "/signup",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { signup }
}

export default useSignup