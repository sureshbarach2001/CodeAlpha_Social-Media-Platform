import axios from "axios"
import constants from "../constants/constants"

function useChangePassword () {
	const { api } = constants()
	
	async function changePassword (formData) {
		try {
			let response = await axios.post(
				api + "/changePassword",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { changePassword }
}

export default useChangePassword