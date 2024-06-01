import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import $ from "jquery"
import Swal from "sweetalert2"

import constants from "../constants/constants"
import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import SinglePost from "./includes/SinglePost"
import useFetchStories from  "../hooks/useFetchStories"
import usePost from "../hooks/usePost"

function HomePage() {
	const [profileImage, setProfileImage] = useState(require("../public/img/default_profile.jpg"))
	const [defaultProfileImage, setDefaultProfileImage] = useState(require("../public/img/default_profile.jpg"))
	const [stories, setStories] = useState([])
	const [posts, setPosts] = useState([])
	const [addingPost, setAddingPost] = useState(false)
	const { api } = constants()
	const { fetchStories } = useFetchStories()
	const { addPost, getNewsfeed } = usePost()

	const user = useSelector(function (state) {
		return state.user
	})

	useEffect(function () {
		if (user != null) {
			if (user.profileImage) {
				setProfileImage(api + "/" + user.profileImage)
			}
		}
	}, [user])
	
	useEffect(function () {
		document.title = "Home"
		getStories()
		fetchNewsfeed()
	}, [])

	async function fetchNewsfeed() {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		const response = await getNewsfeed(formData)
		if (response.status == "success") {
			setPosts(response.data)
		}
	}

	async function getStories() {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		const response = await fetchStories(formData)
		if (response.status == "success") {
			setStories(response.data)
		}
	}

	async function doPost() {
		event.preventDefault()
		setAddingPost(true)

		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))

		const response = await addPost(formData)
		setAddingPost(false)

		if (response.status == "success") {
			const postObj = response.postObj
			form.reset()

			// prepend in newsfeed
			const tempPosts = [...posts]
			tempPosts.unshift(postObj)
			setPosts(tempPosts)

			// render wave surfers for audio
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function showPopupYoutubeURL () {
		$("#modalYoutube").modal("show")
	}

	function onDeletePost(_id) {
		const tempPosts = [...posts]
		for (let a = tempPosts.length - 1; a >= 0; a--) {
			if (tempPosts[a]._id == _id) {
				tempPosts.splice(a, 1)
				break
			}
		}
		setPosts(tempPosts)
	}

	function loadMore () {
		// 
	}

	function readMore () {
		// 
	}

	return (
		<section>
			<div className="gap gray-bg">
				<div className="container-fluid">

					<div className="row" id="storiesApp" style={{
						marginBottom: 20,
						marginLeft: 20,
						marginRight: 20,
						position: 'relative' 
					}}>
						<div className="col-md-2">
							<div id="add-story">
								<img src={profileImage} style={{
									width: 200
								}} />

								<Link to="/AddStory" className="btn btn-primary btn-sm" style={{
									position: "absolute",
									left: 118,
									bottom: 5,
									color: "white"
								}}>+ Add Story</Link>
							</div>
						</div>

						<div className="col-md-10">
							<div className="row stories">
								{ stories.map(function (story, index) {
									return (
										<div className="col-md-2" style={{
											display: 'contents'
										}} key={`story-${story._id}`}>
											<Link to={`/ViewStory?id=${story.user._id}`}>
												<div className="story" style={{
													marginRight: 10,
													position: "relative"
												}}>
													<img src={story.user.profileImage}
														style={{
															width: 150,
															height: 150,
															objectFit: "cover"
														}} />
													<span style={{
														position: "absolute",
													    bottom: 5,
													    left: "50%",
													    transform: "translateX(-50%)",
													    color: "black",
													    backgroundColor: 'white',
													    paddingLeft: 10,
													    paddingRight: 10
													}}>{story.user.name}</span>
												</div>
											</Link>
										</div>
									)
								}) }
							</div>
						</div>
					</div>

					<div className="row" id="page-contents">
						<div className="col-md-3">
							<LeftSidebar />
						</div>

						<div className="col-md-6">
							<div id="add-post-box">
								<div className="central-meta">
									<div className="new-postbox">
										<figure>
											<img src={profileImage} onError={function (event) {
												event.target.src = defaultProfileImage
											}} />
										</figure>

										<div className="newpst-input">
											<form method="post" id="form-add-post" onSubmit={doPost} noValidate encType="multipart/form-data">

												<input name="type" type="hidden" value="post" />
												<textarea rows="2" name="caption" placeholder="write something"></textarea>
												<div className="attachments">
													<ul>
														<li>
															<input type="file" multiple name="files" accept="image/*,audio/*,video/*" />
														</li>

														<li style={{
															marginRight: 20
														}}>
															<i className="fa fa-youtube" onClick={showPopupYoutubeURL} style={{
																cursor: "pointer",
																fontSize: 30
															}}></i>
														</li>

														<li>
															<button type="submit" name="submit" disabled={addingPost}>
																Post
																{addingPost && (
																	<i className="fa fa-spinner fa-spin"></i>
																)}																
															</button>
														</li>
													</ul>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>

							<div className="loadMore" id="newsfeed">
								{ posts.map(function (data, index) {
									return (
										<SinglePost data={data}
											onDelete={onDeletePost}
											key={`post-${data._id}`} />
									)
								}) }
							</div>

							<button className="btn-view btn-load-more" onClick={loadMore}>Load More</button>
						</div>

						<div className="col-md-3">
							<RightSidebar />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomePage