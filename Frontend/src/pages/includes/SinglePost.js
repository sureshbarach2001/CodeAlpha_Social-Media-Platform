import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2"

import constants from "../../constants/constants"
import { urlify, closeModal, showModal } from "../../public/js/script.js"
import usePost from "../../hooks/usePost"

function SinglePost({ data, onDelete = null }) {
	const { api } = constants()
	const [likers, setLikers] = useState(data.likers || [])
	const [isLiked, setIsLiked] = useState(false)
	const [dislikers, setDislikers] = useState(data.dislikers || [])
	const [isDisliked, setIsDisliked] = useState(false)
	const [comments, setComments] = useState(data.comments || [])
	const [shares, setShares] = useState(data.shares || [])
	const { fetchPostSharers, deletePost, toggleLikePost, fetchPostLikers, toggleDislikePost, fetchPostDisLikers, fetchCommentsByPost, sharePost } = usePost()
	const dispatch = useDispatch()

	const user = useSelector(function (state) {
		return state.user
	})

	useEffect(function () {
		for (var b = 0; b < likers.length; b++) {
			var liker = likers[b];
			if (liker._id == user?._id) {
				setIsLiked(true)
				break;
			}
		}

		for (var b = 0; b < dislikers.length; b++) {
			var disliker = dislikers[b];
			if (disliker._id == user?._id) {
				setIsDisliked(true);
				break;
			}
		}
	}, [])

	function getDate (data) {
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		var createdAt = new Date(data.createdAt);
		var date = createdAt.getDate() + "";
		date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear();
		return date
	}

	function getExtension (filename) {
		const nameParts = filename.split(".")
		return nameParts[nameParts.length - 1]
	}

	function getYTURL (data) {
		let youtube_url = data.youtube_url
		return youtube_url.replace("watch?v=", "embed/")
	}

	function getPostCaption (data) {
		let caption = data.caption
		const maxLength = 140
		let result = caption.substring(0, maxLength)
		return urlify(result)
	}

	function getMoreText (data) {
		let caption = data.caption
		const maxLength = 140
		return caption.substring(maxLength, caption.length)
	}

	function hasEllipsis (data) {
		let caption = data.caption
		const maxLength = 140
		let result = caption.substring(0, maxLength)
		return (caption.length > maxLength)
	}

	function isMyUploaded (data) {
		if (data.type == "group_post") {
			if (data.uploader._id == user?._id) {
				return true
			}
		} else if (data.user?._id == user?._id) {
			return true
		}
		return false
	}

	async function onClickToggleLikePost (_id) {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)
		
		const response = await toggleLikePost(formData)
		if (response.status == "success") {
			const obj = response.obj
			const temp = [...likers, {
				obj
			}]
			setLikers(temp)
			setIsLiked(true)
		} else if (response.status == "unliked") {
			const temp = likers.filter(function (item, index) {
				return item._id == _id
			})
			setLikers(temp)
			setIsLiked(false)
		} else if (response.status == "error") {
			Swal.fire("Error", response.message, "error")
		}
	}

	async function onClickShowPostLikers (_id) {
		showModal("post-likers-modal")
		
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)
		
		const response = await fetchPostLikers(formData)
		if (response.status == "success") {
			dispatch({
				type: "updateLikers",
				likers: response.data
			})
		} else {
			// 
		}
	}

	async function onClickToggleDislikePost (_id) {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)
		
		const response = await toggleDislikePost(formData)
		if (response.status == "success") {
			const obj = response.obj
			const temp = [...dislikers, {
				obj
			}]
			setDislikers(temp)
			setIsDisliked(true)
		} else if (response.status == "undisliked") {
			const temp = dislikers.filter(function (item, index) {
				return item._id == _id
			})
			setDislikers(temp)
			setIsDisliked(false)
		} else if (response.status == "error") {
			Swal.fire("Error", response.message, "error")
		}
	}

	async function onClickShowPostDislikers (_id) {
		showModal("post-dislikers-modal")
		
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)
		
		const response = await fetchPostDisLikers(formData)
		if (response.status == "success") {
			dispatch({
				type: "updateDisLikers",
				dislikers: response.data
			})
		} else {
			// 
		}
	}

	async function onClickShowCommentsModal (_id) {
		showModal("postCommentsModal")
		
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)
		
		const response = await fetchCommentsByPost(formData)
		if (response.status == "success") {
			dispatch({
				type: "updatePostComments",
				postComments: response.comments
			})

			document.getElementById("form-post-comment")._id.value = _id
		} else {
			// 
		}
	}

	async function onClickSharePost (_id) {
		Swal.fire({
			title: "Write Caption",
			input: "text",
			inputAttributes: {
				autocapitalize: "off"
			},
			showCancelButton: true,
			confirmButtonText: "Share post",
			showLoaderOnConfirm: true,
			preConfirm: async function (caption) {
				const formData = new FormData()
				formData.append("accessToken", localStorage.getItem("accessToken"))
				formData.append("_id", _id)
				formData.append("caption", caption)

				const response = await sharePost(formData)
				return response
			},

			allowOutsideClick: function () {
				return !Swal.isLoading()
			}
		}).then(function (result) {
			if (result.isConfirmed) {
				if (result.value.status == "success") {
					Swal.fire("Share Post", result.value.message, "success")

					const temp = [...shares]
					temp.unshift(result.value.obj)
					setShares(temp)
				} else {
					Swal.fire("Error", result.value.message, "error")
				}
			}
		})
	}

	function deletePostModal(_id) {
		Swal.fire({
			title: "Are you sure you want to delete this post ?",
			showCancelButton: true,
			confirmButtonText: "Delete"
		}).then(async function (result) {
			if (result.isConfirmed) {
				const formData = new FormData()
				formData.append("accessToken", localStorage.getItem("accessToken"))
				formData.append("_id", _id)
				const response = await deletePost(formData)
				if (response.status == "success") {
					if (onDelete != null) {
						onDelete(_id)
					}
				} else {
					Swal.fire("Error", response.message, "error")
				}
			}
		})
	}

	/*async function onClickShareInPage (_id) {
		//
	}

	async function onClickShareInGroup (_id) {
		//
	}*/

	async function onClickShowPostShares (_id) {
		showModal("post-sharers-modal")

		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("_id", _id)

		const response = await fetchPostSharers(formData)
		if (response.status == "success") {
			dispatch({
				type: "postSharers",
				postSharers: response.data
			})
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	return (
		<div style={{
			display: "contents"
		}}>
			{ !data.isBanned && (
				<div className="central-meta item" id={`post-${data._id}`}>
					<div className="user-post">
						<div className="friend-info">

							{ data.isBoost && (
								<p>Sponsored</p>
							) }

							<figure>
								<img src={`${api}/${(data.type == "group_post" ? data.uploader?.profileImage : data.user?.profileImage)}`}
									style={{
										width: 45,
										height: 45,
										objectFit: "cover"
									}}
									onError={function (event) {
										event.target.src = require("../../public/img/default_profile.jpg")
									}} />
							</figure>

							<div className="friend-name">
								<ins>
									{ data.user != null && (
										<>
											{ (data.type == "post" || data.type == "shared") ? (
												<Link to={`/User/${data.user.username}`}>
													{ data.user.name }
												</Link>
											) : data.type == "group_post" ? (
												<Link to={`/Group/${data.user._id}`}>
													{ data.user.name }
												</Link>
											) : data.type == "page_post" ? (
												<Link to={`/Page/${data.user._id}`}>
													{ data.user.name }
												</Link>
											) : (
												<span>{ data.user.name }</span>
											)}
										</>
									) }

									{ isMyUploaded(data) && (
										<>
											<i className="fa fa-trash delete-post" onClick={function () {
												deletePostModal(data._id)
											}}></i>

											{/*<i className="fa fa-pencil edit-post" onClick={function () {
												editPostModal(data._id)
											}}></i>*/}
										</>
									) }

									<Link to={`/PostDetail/${data._id}`} className="detail-post"
										style={{
											position: "relative",
											bottom: 5
										}}>
										<i className="fa fa-eye"></i>
									</Link>

								</ins>

								<span>Published: {getDate(data)}</span>
								
								{ data.originalPost != null && (
									<span>
										Original <Link to={`/PostDetail/${data.originalPost._id}`}>post</Link>
										&nbsp;by&nbsp;
										<Link to={`/User/${data.originalPost.user.username}`}>{ data.originalPost.user.name }</Link>
									</span>
								) }

							</div>

							<div className="post-meta">

								{ hasEllipsis(data) && (
									<span style={{
										display: "contents"
									}}>
										<span className='ellipsis'> ...</span>
										<span className='read-more-text' style='display: none;'>{ getMoreText(data) }</span>
										<a href='#' onClick={function () {
											readMore()
										}}> read more</a>
									</span>
								) }

								<div className="description">
									<p>{ getPostCaption(data) }</p>
								</div>

								{ data.savedPaths != null && (
									<div className="gridAttachments">
										{ data.savedPaths.map(function (savedPath, savedPathIndex) {
											const parts = savedPath.split(".")
											const extension = parts[parts.length - 1]

											return (
												<div style={{
													display: "contents"
												}} key={`savedPath-${data._id}-${savedPathIndex}`}>
													{ savedPathIndex < 4 && (
														<>
															{ (extension == "jpg" || extension == "jpeg" || extension == "png") ? (
																<img className="post-image" src={`${api}/${savedPath}`} />
															) : (extension == "mp4" || extension == "mov" || extension == "mkv") ? (
																<video className="post-video" style={{
																	height: 359,
																	width: "100%"
																}} controls src={`${api}/${savedPath}`}></video>
															) : (extension == "mp3" || extension == "m4a" || extension == "aac") && (
																<>
																	<audio className="post-audio" controls src={`${api}/${savedPath}`}
																		id={`audio-post-${data._id}`}></audio>
																	<div id={`waveform-post-${data._id}`}></div>
																</>
															) }

															{ savedPathIndex == 3 && (
																<Link style={{
																	display: "contents"
																}} to={`/Post?id=${data._id}`}>
																	<div className="overlayAttachment">
																		<div className="text">+</div>
																	</div>
																</Link>
															) }
														</>
													) }
												</div>
											)
										}) }
									</div>
								) }

								{ (data.youtube_url && data.youtube_url != "") && (
									<iframe width="560" height="315" src={getYTURL(data)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
								) }

								{ (data.document && data.document != "") && (
									<Link to={data.document} target="_blank">
										<i className={`fa fa-file-${getExtension(data.document)}-o`} style={{
											fontSize: 50
										}}></i>
									</Link>
								) }

								<div className="we-video-info">
									<ul>
										<li>
											<span className={isLiked ? "like" : "none"} onClick={function () {
												onClickToggleLikePost(data._id)
											}}>
												<i className="ti-thumb-up"></i>
											</span>

											<ins className="likers-count" onClick={function () {
												onClickShowPostLikers(data._id)
											}}>{ likers.length }</ins>
										</li>

										<li>
											<span className={isDisliked ? "dislike" : "none"} onClick={function () {
												onClickToggleDislikePost(data._id)
											}}>
												<i className="ti-thumb-down"></i>
											</span>

											<ins className="dislikers-count" onClick={function () {
												onClickShowPostDislikers(data._id)
											}}>{ dislikers.length }</ins>
										</li>

										<li>
											<button type="button" onClick={function () {
												onClickShowCommentsModal(data._id)
											}}
												style={{
													background: "none",
													border: "none"
												}}>
												<span className="comment" title="Comments">
													<i className="fa fa-comments-o"></i>

													<ins id={`count-post-comments-${data._id}`}>{comments.length}</ins>
												</span>
											</button>
										</li>
										
										<li>
											<span className="share" style={{
												position: 'relative',
												top: 9 
											}}>
												<div className="dropdown" style={{
													position: "relative",
													top: 20
												}}>
													<button className="dropdown-toggle" type="button" id={`dropdownShare-${data._id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
													style={{
														background: "none",
														border: "none"
													}}>
														<i className="ti-share"></i>
													</button>

													<div className="dropdown-menu" aria-labelledby={`dropdownShare-${data._id}`}>
														<a className="dropdown-item" href="#" onClick={function () {
															event.preventDefault()
															onClickSharePost(data._id)
														}}>Share on your timeline</a>

														{/*<a className="dropdown-item" href="#" onClick={function () {
															onClickShareInPage(data._id)
														}}>Share on pages you manage</a>
														
														<a className="dropdown-item" href="#" onClick={function () {
															onClickShareInGroup(data._id)
														}}>Share in groups</a>*/}
													</div>
												</div>

												<ins className="shares-count" onClick={function () {
													onClickShowPostShares(data._id)
												}} id={`shares-count-${data._id}`}>{ shares.length }</ins>
											</span>
										</li>

									</ul>
								</div>
							</div>
						</div>

						{ isMyUploaded(data) && (
							<div className='row'>
								<div className='offset-md-9 col-md-3'>
									{ data.isBoost ? (
										<a href='#' style={{
											backgroundColor: "gray",
											color: "white",
											padding: 5
										}} className='pull-right'>Boost post</a>
									) : (
										<Link to={`/Boost/${data._id}`} style={{
											backgroundColor: "#088dcd",
											color: "white",
											padding: 5
										}} className='pull-right'>Boost post</Link>
									) }
								</div>
							</div>
						) }
					</div>

				</div>
			) }
		</div>
	)
}

export default SinglePost