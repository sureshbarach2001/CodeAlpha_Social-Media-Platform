import { useEffect } from "react"

function AboutPage() {
	useEffect(function () {
		document.title = "About"
	}, [])

	return (
		<h1>About</h1>
	)
}

export default AboutPage