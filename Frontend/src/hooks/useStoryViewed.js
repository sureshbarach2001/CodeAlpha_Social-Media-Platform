import axios from "axios"
import constants from "../constants/constants"

function useStoryViewed () {
	const { api } = constants()
	
	async function storyViewed (formData) {
		try {
			let response = await axios.post(
				api + "/storyViewed",
				formData
			)
			response = response.data

			return response
		} catch (exp) {
			// 
		}
	}

	return { storyViewed }
}

export default useStoryViewed