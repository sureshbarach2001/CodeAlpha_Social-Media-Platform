import axios from "axios"
import constants from "../constants/constants"

function useDeleteStory () {
	const { api } = constants()
	
	async function deleteStory (formData) {
		try {
			let response = await axios.post(
				api + "/deleteStory",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { deleteStory }
}

export default useDeleteStory