import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import NProgress from "nprogress"
import Swal from "sweetalert2"

import usePost from "../hooks/usePost"
import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import SinglePost from "./includes/SinglePost"

function PostDetail() {
	const { id } = useParams()
	const [post, setPost] = useState(null)
	const navigate = useNavigate()

	async function onInit() {
		// const urlSearchParams = new URLSearchParams(window.location.search)
		// const id = urlSearchParams.get("id") || ""
		NProgress.start()

		const formData = new FormData()
		formData.append("_id", id)

		const { fetchPost } = usePost()
		const response = await fetchPost(formData)
		NProgress.done()

		if (response.status == "success") {
			setPost(response.post)
		} else {
			Swal.fire("Error", response.message, "error");
		}
	}

	useEffect(function () {
		onInit()
	}, [])

	return (
		<section>
			<div className="gap gray-bg">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<div className="row" id="page-contents">

								<div className="col-md-3">
									<LeftSidebar />
								</div>

								<div className="col-md-6">

									<div className="central-meta">
										{ post != null && (
											<SinglePost data={ post }
												onDelete={ function () {
													navigate("/")
												} } />
		                                ) }
									</div>

								</div>

		                        <div className="col-md-3">
									<RightSidebar />
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default PostDetail