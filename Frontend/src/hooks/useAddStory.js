import axios from "axios"
import constants from "../constants/constants"

function useAddStory () {
	const { api } = constants()
	
	async function addStory (formData) {
		try {
			let response = await axios.post(
				api + "/addStory",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { addStory }
}

export default useAddStory