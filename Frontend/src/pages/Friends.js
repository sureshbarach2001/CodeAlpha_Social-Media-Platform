import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import hooks from "../utils/hooks"

function Friends() {
	const user = useSelector(function (state) {
		return state.user
	})
	const dispatch = useDispatch()

	async function doAccept(_id) {
		const response = await hooks.acceptFriendRequest(_id)
		if (response?.status == "success") {
			const tempUser = Object.assign({}, user)
			for (let a = tempUser.friends.length - 1; a >= 0; a--) {
				if (tempUser.friends[a]._id == _id) {
					tempUser.friends[a].status = "Accepted"
				}
			}
			dispatch({
				type: "updateUser",
				user: tempUser
			})
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	async function doUnfriend(_id) {
		const response = await hooks.unfriend(_id)
		if (response?.status == "success") {
			const tempUser = Object.assign({}, user)
			for (let a = tempUser.friends.length - 1; a >= 0; a--) {
				if (tempUser.friends[a]._id == _id) {
					tempUser.friends.splice(a, 1)				
				}
			}
			dispatch({
				type: "updateUser",
				user: tempUser
			})
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

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
										<div className="frnds">

											<div className="tab-content">
												<div className="tab-pane active fade show" id="frends">

													<ul className="nearby-contct" id="friends">
														{ user != null && (
															<>
																{ user.friends.map(function (data) {
																	return (
																		<li key={`friend-${data._id}`}>
																			<div className="nearly-pepls">
																				<figure>
																					<Link to={`/User/${data.username}`}>
																						<img src={ data.profileImage }
																							onError={function () {
																								event.target.src = require("../public/img/default_profile.jpg")
																							}} />
																					</Link>
																				</figure>

																				<div className="pepl-info">
																					<h4>
																						<Link to={`/User/${data.username}`}>{ data.name }</Link>
																					</h4>

																					{ (!data.sentByMe && data.status == "Pending") && (
																						<a href="#" onClick={function () {
																							event.preventDefault()
																							doAccept(data._id)
																						}} className="add-butn more-action">Accept</a>
																					) }

																					<a href="#" onClick={function () {
																						event.preventDefault()
																						doUnfriend(data._id)
																					}} className="add-butn btn-unfriend">Unfriend</a>
																				</div>
																			</div>
																		</li>
																	)
																}) }
															</>
														) }
													</ul>

												</div>
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

export default Friends