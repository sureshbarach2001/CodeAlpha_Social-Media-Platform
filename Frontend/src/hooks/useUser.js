import axios from "axios"
import constants from "../constants/constants"

function useUser () {
	const { api } = constants()
	
	async function fetchUserWithNewsfeed (formData) {
		try {
			let response = await axios.post(
				api + "/fetchUserWithNewsfeed",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { fetchUserWithNewsfeed }
}

export default useUser