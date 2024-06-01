import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import NProgress from "nprogress"
import Swal from "sweetalert2"

import useUser from "../hooks/useUser"
import SinglePost from "./includes/SinglePost"
import RightSidebar from "./includes/RightSidebar"

function User() {
	// const [id, setId] = useState("")
	const { id } = useParams()
	const [u, setU] = useState(null)
	const [newsFeed, setNewsFeed] = useState([])

	async function onInit() {
		// const urlSearchParams = new URLSearchParams(window.location.search)
		// const id = urlSearchParams.get("user") || ""
		// setId(id)
		NProgress.start()

		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("username", id)

		const { fetchUserWithNewsfeed } = useUser()
		const response = await fetchUserWithNewsfeed(formData)
		NProgress.done()

		if (response.status == "success") {
			setU(response.user)
			setNewsFeed(response.newsFeed)
		} else {
			Swal.fire("Error", response.message, "error");
		}
	}

	useEffect(function () {
		onInit()
	}, [])

	return (
		<div id="profileApp" style={{
			display: "contents"
		}}>
			{ u != null && (
				<>
					<section>
						<div className="feature-photo">

							<figure>
								<img className="cover-photo" id="cover-photo" style={{
									width: "100%",
									height: 700,
									objectFit: "cover"
								}} src={ u.coverPhoto }
									onError={function () {
										event.target.src = require("../public/img/default_cover.jpg")
									}} />
							</figure>

							<div className="container-fluid">
								<div className="row merged">
									<div className="col-md-2">
										<div className="user-avatar">
											<figure>
												<img className="profile-image" id="profile-image" style={{
													width: "100%",
													height: 150,
													objectFit: "cover"
												}} 
													src={ u.profileImage }
													onError={function () {
														event.target.src = require("../public/img/default_profile.jpg")
													}} />
											</figure>
										</div>
									</div>
									<div className="col-md-10">
										<div className="timeline-info">
											<ul>
												<li className="admin-name">
													<h5 className="user-name" style={{
														paddingTop: 20,
														paddingBottom: 20
													}}>{ u.name }</h5>

													{ !u.profileLocked && (
														<span>{ u.friends } friends</span>
													) }
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section>
						<div className="gap gray-bg">
							<div className="container-fluid">
								<div className="row">
									<div className="col-md-12">
										<div className="row" id="page-contents">

											<div className="col-md-3">
												<div className="central-meta">
													<div className="editing-info">
					                                    <p><b>Full Name:</b> { u.name }</p>
					                                    
					                                    { !u.profileLocked && (
					                                    	<>
					                                    		<p><b>Email:</b> { u.email }</p>
							                                    <p><b>Date of Birth:</b> { u.dob == '' ? 'N/A' : u.dob }</p>
							                                    <p><b>City:</b> { u.city == '' ? 'N/A' : u.city }</p>
							                                    <p><b>Country:</b> { u.country == '' ? 'N/A' : u.country }</p>
							                                    <p><b>About:</b> { u.aboutMe == '' ? 'N/A' : u.aboutMe }</p>
					                                    	</>
					                                    ) }
													</div>
												</div>
											</div>

					                        <div className="col-md-6">
					                            <div className="loadMore" id="newsfeed">
					                            	{ newsFeed.map(function (post) {
					                            		return (
					                            			<SinglePost data={post}
					                            				key={`post-${post._id}`} />
					                            		)
					                            	}) }
					                            </div>

					                            { u.profileLocked && (
					                            	<div className="central-meta item">
						                            	<p style={{
						                            		fontSize: 26
						                            	}}>
						                            		<i className="fa fa-lock"></i>
						                            		This profile is locked.
						                            	</p>
						                            </div>
					                            ) }
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
				</>
			) }
		</div>
	)
}

export default User