import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"

import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import useGroup from "../hooks/useGroup"

function Groups() {
	const [groups, setGroups] = useState([])
	const [ads, setAds] = useState([])
	const [adIndex, setAdIndex] = useState(-1)
	const [hasDisplayedAd, setHasDisplayedAd] = useState(false)
	const user = useSelector(function (state) {
		return state.user
	})

	async function onInit () {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))

		const response = await useGroup.fetch(formData)
		if (response.status == "success") {
			setGroups(response.data)
			setAds(response.ads)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function randomAdIndex() {
		const index = Math.floor(Math.random() * ads.length)
		setAdIndex(index)
	}

	async function toggleJoinGroup(_id) {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)

		const response = await useGroup.toggleJoin(formData)
		if (response.status == "success") {
			Swal.fire("Group Joined", response.message, "success")
		} else if (response.status == "leaved") {
			Swal.fire("Group Left", response.message, "info")
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function hasJoined(group) {
		if (user == null) {
			return false
		}

		var isMember = false;
		for (var a = 0; a < group.members.length; a++) {
			var member = group.members[a];

			if (member._id.toString() == user._id.toString()) {
				isMember = true
				break
			}
		}

		if (!isMember) {
			isMember = group.user._id.toString() == user._id.toString()
		}

		return isMember
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
										<div className="editing-interest">
											<h5 className="f-title"><i className="ti-bell"></i>All Groups</h5>
											<div className="notification-box">
												<ul id="all-groups">
													{ groups.map(function (data) {
														return (
															<li key={`group-${data._id}`}>
																{ ads.length > 0 && !hasDisplayedAd && (
																	<div className="nearly-pepls">
																		<div className="pepl-info">
																			<p>Sponsored</p>

																			<h4>
																				<Link to={`/PostDetail/${ads[0]._id}`}>{ ads[0].caption }</Link>
																			</h4>

																			{ ads[0].savedPaths.length > 0 && (
																				<img src={ ads[0].savedPaths[0] } />
																			) }
																		</div>
																	</div>
																) }

																<div className="nearly-pepls">
																	<figure>
																		<Link to={`/Group/${data._id}`}>
																			<img src={ data.coverPhoto } style={{
																				width: 45,
																				height: 45,
																				objectFit: "cover"
																			}} />
																		</Link>
																	</figure>

																	<div className="pepl-info">
																		<h4>
																			<Link to={`/Group/${data._id}`}>{ data.name }</Link>
																		</h4>

																		<span>public group</span>
																		<em>{ data.members.length } Members</em>

																		{ hasJoined(data) ? (
																			<a href="#" onClick={function () {
																				event.preventDefault()
																				toggleJoinGroup(data._id)
																			}} className="add-butn btn-unfriend">Leave</a>
																		) : (
																			<a href="#" onClick={function () {
																				event.preventDefault()
																				toggleJoinGroup(data._id)
																			}} className="add-butn btn-friend">Join</a>
																		) }
																	</div>
																</div>
															</li>
														)
													}) }
												</ul>
											</div>
										</div>
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

export default Groups