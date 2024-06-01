import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2"

import hooks from "../utils/hooks"

function Search() {
	const { query } = useParams()
	const [users, setUsers] = useState([])
	const [pages, setPages] = useState([])
	const [groups, setGroups] = useState([])
	const [events, setEvents] = useState([])
	const user = useSelector(function (state) {
		return state.user
	})
	const dispatch = useDispatch()

	function isFriend(u) {
		if (user == null) { return false }

		for (var b = 0; b < user.friends.length; b++) {
			if (user.friends[b]._id == u._id) {
				return true
			}
		}
		return false
	}

	function isLiked(p) {
		if (user == null) { return false }

		for (const liker of p.likers) {
			if (liker._id == user._id) {
				return true
			}
		}
		return false
	}

	function isMember(g) {
		if (user == null) { return false }

		for (const member of g.members) {
			if (member._id == user._id) {
				return true
			}
		}
		return false
	}

	async function onInit() {
		const response = await hooks.search(query)
		if (response?.status == "success") {
			setUsers(response.users)
			setPages(response.pages)
			setGroups(response.groups)
			setEvents(response.events)
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	useEffect(function () {
		onInit()
	}, [])

	async function doUnfriend(_id) {
		const response = await hooks.unfriend(_id)
		if (response?.status == "success") {
			if (user != null) {
				const tempFriends = [...user.friends]
				for (let a = tempFriends.length - 1; a >= 0; a--) {
					if (tempFriends[a]._id == _id) {
						tempFriends.splice(a, 1)
						break
					}
				}
				const tempUser = Object.assign({}, user)
				tempUser.friends = tempFriends
				dispatch({
					type: "updateUser",
					user: tempUser
				})
			}
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	async function sendFriendRequest(_id) {
		const response = await hooks.sendFriendRequest(_id)
		if (response != null && response.status == "success") {
			if (user != null) {
				const tempFriends = [...user.friends]
				tempFriends.unshift(response.friend)
				const tempUser = Object.assign({}, user)
				tempUser.friends = tempFriends
				dispatch({
					type: "updateUser",
					user: tempUser
				})
			}
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	async function toggleLikePage(_id) {
		const response = await hooks.toggleLikePage(_id)
		if (response != null) {
			if (user != null) {
				const tempPages = [...pages]
				if (response.status == "success") {
					for (let a = tempPages.length - 1; a >= 0; a--) {
						if (tempPages[a]._id == _id) {
							tempPages[a].likers.unshift(response.obj)
							break
						}
					}
				} else if (response.status == "unliked") {
					for (let a = tempPages.length - 1; a >= 0; a--) {
						if (tempPages[a]._id == _id) {
							for (let b = tempPages[a].likers.length - 1; b >= 0; b--) {
								if (tempPages[a].likers[b]._id == user._id) {
									tempPages[a].likers.splice(b, 1)
									break
								}
							}
						}
					}
				}
				setPages(tempPages)
			}
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	async function toggleJoinGroup(_id) {
		const response = await hooks.toggleJoinGroup(_id)
		if (response != null) {
			if (user != null) {
				const tempGroups = [...groups]
				if (response.status == "success") {
					for (let a = tempGroups.length - 1; a >= 0; a--) {
						if (tempGroups[a]._id == _id) {
							tempGroups[a].members.unshift(response.obj)
							break
						}
					}
				} else if (response.status == "leaved") {
					for (let a = tempGroups.length - 1; a >= 0; a--) {
						if (tempGroups[a]._id == _id) {
							for (let b = tempGroups[a].members.length - 1; b >= 0; b--) {
								if (tempGroups[a].members[b]._id == user._id) {
									tempGroups[a].members.splice(b, 1)
									break
								}
							}
						}
					}
				}
				setGroups(tempGroups)
			}
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
							<div className="timeline-info">
								<ul className="nav nav-tabs">
									<li>
										<a className="active" data-toggle="tab" href="#people">People</a>
										<a data-toggle="tab" href="#pages">Pages</a>
										<a data-toggle="tab" href="#groups">Groups</a>
										<a data-toggle="tab" href="#events">Events</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<div className="row" id="page-contents">

								<div className="col-md-12">
									<div className="central-meta">
										<div className="frnds">

											<div className="tab-content">
												<div className="tab-pane active fade show" id="people">
													<ul className="nearby-contct" id="search-results">
														{ users.map(function (u) {
															return (
																<li key={`search-result-user-${u._id}`}>
																	<div className="nearly-pepls">
																		<figure>
																			<Link to={`/User/${u.username}`}>
																				<img src={ u.profileImage }
																					onError={function () {
																						event.target.src = require("../public/img/default_profile.jpg")
																					}} />
																			</Link>
																		</figure>

																		<div className="pepl-info">
																			<h4>
																				<Link to={`/User/${u.username}`}>{ u.name }</Link>
																			</h4>

																			{ isFriend(u) ? (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					doUnfriend(u._id)
																				}} className="add-butn btn-unfriend">Unfriend</a>
																			) : (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					sendFriendRequest(u._id)
																				}} className="add-butn">Add Friend</a>
																			) }
																		</div>
																	</div>
																</li>
															)
														}) }
													</ul>
												</div>

												<div className="tab-pane fade" id="pages">
													<ul className="nearby-contct" id="search-result-pages">
														{ pages.map(function (p) {
															return (
																<li key={`search-result-page-${p._id}`}>
																	<div className="nearly-pepls">
																		<figure>
																			<Link to={`/Page/${p._id}`}>
																				<img src={ p.coverPhoto }
																					onError={function () {
																						event.target.src = require("../public/img/default_cover.jpg")
																					}} />
																			</Link>
																		</figure>

																		<div className="pepl-info">
																			<h4>
																				<Link to={`/Page/${p._id}`}>{ p.name }</Link>
																			</h4>

																			{ isLiked(p) ? (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					toggleLikePage(p._id)
																				}} className="add-butn btn-unfriend">Unlike</a>
																			) : (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					toggleLikePage(p._id)
																				}} className="add-butn">Like</a>
																			) }
																		</div>
																	</div>
																</li>
															)
														}) }
													</ul>
												</div>

												<div className="tab-pane fade" id="groups">
													<ul className="nearby-contct" id="search-result-groups">
														{ groups.map(function (g) {
															return (
																<li key={`search-result-group-${g._id}`}>
																	<div className="nearly-pepls">
																		<figure>
																			<Link to={`/Group/${g._id}`}>
																				<img src={ g.coverPhoto }
																					onError={function () {
																						event.target.src = require("../public/img/default_cover.jpg")
																					}} />
																			</Link>
																		</figure>

																		<div className="pepl-info">
																			<h4>
																				<Link to={`/Group/${g._id}`}>{ g.name }</Link>
																			</h4>

																			<span>public group</span>
																			<em>{ g.members.length } Members</em>

																			{ isMember(g) ? (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					toggleJoinGroup(g._id)
																				}} className="add-butn btn-unfriend">Leave</a>
																			) : (
																				<a href="#" onClick={function () {
																					event.preventDefault()
																					toggleJoinGroup(g._id)
																				}} className="add-butn">Join</a>
																			) }
																		</div>
																	</div>
																</li>
															)
														}) }
													</ul>
												</div>

												<div className="tab-pane fade" id="events">
													<ul className="nearby-contct" id="search-result-events">
														{ events.map(function (data) {
															return (
																<li key={`search-result-event-${data._id}`}>
																	<div className="nearly-pepls">
																		<figure>
																			<Link to={`/Event/${data._id}`}>
																				<img className={`post-image ${data.image == "" ? "hide" : ""}`}
																					src={ data.image }
																					onError={function () {
																						event.target.src = require("../public/img/default_cover.jpg")
																					}} />
																			</Link>
																		</figure>

																		<div className="pepl-info">
																			<h4>
																				<Link to={`/Event/${data._id}`}>{ data.name }</Link>
																			</h4>

																			<em>{ data.going.length } going</em>
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
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Search