import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import { getDate, closeModal } from "../../public/js/script.js"
import usePost from "../../hooks/usePost"

function Footer() {
	const [year, setYear] = useState(new Date().getFullYear())
	const dispatch = useDispatch()

	const visibleLikers = useSelector(function (state) {
		return state.likers
	})

	const visibleDislikers = useSelector(function (state) {
		return state.dislikers
	})

	const postComments = useSelector(function (state) {
		return state.postComments
	})

	const postSharers = useSelector(function (state) {
		return state.postSharers
	})

	function deletePost() {
		// 
	}

	function showPopupYoutubeURL() {
		// 
	}

	function doPostReply() {
		// 
	}

	function doReply() {
		//
	}

	async function doPostComment() {
		event.preventDefault()

		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))
		
		const { postComment } = usePost()
		const response = await postComment(formData)
		if (response.status == "success") {
			dispatch({
				type: "updatePostComments",
				postComments: response.updatePost.comments.reverse()
			})

			setTimeout(function () {
				const objDiv = document.getElementById("post-comments")
				objDiv.scrollTop = 0
				// objDiv.scrollTop = objDiv.scrollHeight
			}, 500)
			form.comment.value = ""
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function doEditPost() {
		// 
	}

	return (
		<div>
			<footer>
				<div className="container">
					<div className="row">
						<div className="col-12 text-center">
							Social Network &copy; { year }. Developed by <a href="https://sureshbarach2001.freewebhostmost.com/" target="_blank">Suresh Kumar</a>
						</div>
					</div>
				</div>
			</footer>

			<div className="modal" tabIndex="-1" role="dialog" id="modalYoutube">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Enter Youtube URL</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

						<div className="modal-body">
							<p>
								<input type="url" name="youtube_url" placeholder="Enter youtube URL" required className="form-control" form="form-add-post" />
							</p>
						</div>
						
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" data-dismiss="modal">Add Youtube URL</button>
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>

			<div id="post-likers-modal" className="modal">
				<div className="modal-content" style={{
					width: 500
				}}>
					<span className="close" onClick={function () {
						closeModal("post-likers-modal")
					}}>&times;</span>

					{ visibleLikers.map(function (liker, index) {
						return (
							<div className="row" style={{
								marginTop: 20
							}} key={`liker-${liker._id}`}>
								<div className="col-md-2">
									<figure>
										<Link to={`/user/${liker.username}`} onClick={function () {
											closeModal("post-likers-modal")
										}}>
											<img src={liker.profileImage} />
										</Link>
									</figure>
								</div>

								<div className="col-md-10 pepl-info">
									<h4>
										<Link to={`/user/${liker.username}`} onClick={function () {
											closeModal("post-likers-modal")
										}}>{liker.name}</Link>
									</h4>
									<p>{getDate(liker.createdAt)}</p>
								</div>
							</div>
						)
					}) }
				</div>
			</div>

			<div id="post-dislikers-modal" className="modal">
				<div className="modal-content" style={{
					width: 500
				}}>
					<span className="close" onClick={function () {
						closeModal("post-dislikers-modal")
					}}>&times;</span>

					{ visibleDislikers.map(function (liker, index) {
						return (
							<div className="row" style={{
								marginTop: 20
							}} key={`liker-${liker._id}`}>
								<div className="col-md-2">
									<figure>
										<Link to={`/user/${liker.username}`} onClick={function () {
											closeModal("post-dislikers-modal")
										}}>
											<img src={liker.profileImage} />
										</Link>
									</figure>
								</div>

								<div className="col-md-10 pepl-info">
									<h4>
										<Link to={`/user/${liker.username}`} onClick={function () {
											closeModal("post-dislikers-modal")
										}}>{liker.name}</Link>
									</h4>
									<p>{getDate(liker.createdAt)}</p>
								</div>
							</div>
						)
					}) }
				</div>
			</div>

			<div className="modal" id="postCommentsModal">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Comments</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"
								onClick={function () {
									closeModal("postCommentsModal")
								}}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

						<div className="modal-body">

							<table className="table table-bordered">
								<tbody></tbody>
							</table>

							<div id="post-comments" style={{
								height: 200,
								overflowX: "hidden",
							    overflowY: "scroll"
							}}>
								{ postComments.map(function (comment) {
									return (
										<div className="row" style={{
											border: "1px solid lightgray",
											padding: 15,
											marginBottom: 20,
											borderRadius: 10
										}}>
											<div className="col-md-2">
												<Link to={`/user/${comment.user._id}`} onClick={function () {
													closeModal("postCommentsModal")
												}}>
													<img className="profile-image" style={{
														width: 50,
														height: 50,
														objectFit: "cover",
														display: "block",
														borderRadius: "50%"
													}}
														src={ comment.user.profileImage } />

													{ comment.user.name }
												</Link>
											</div>

											<div className="col-md-10" style={{
												backgroundColor: '#f5f5f5',
												borderRadius: 10,
												padding: 20
											}}>
												{ comment.comment }
												<br />
												{ getDate(comment.createdAt) }
												
												{/*<br />
												<button type="button" className="mtr-btn pull-right" onClick={function () {
													doReply(comment._id)
												}} style={{
													marginBottom: 20
												}}>
													<span>Reply</span>
												</button>*/}

												<div data-id-replies={comment._id}>

													{ comment.replies.reverse().map(function (reply) {
														return (
															<div className="row" style={{
																clear: "both",
																marginTop: 20
															}}>
																<div className="col-md-2">
																	<Link to={`/user/${reply.user._id}`} onClick={function () {
																		closeModal("postCommentsModal")
																	}}>
																		<img className="profile-image" style={{
																			width: 50,
																			height: 50,
																			objectFit: "cover",
																			display: "block",
																			borderRadius: "50%"
																		}} src={reply.user.profileImage} />

																		{ reply.user.name }
																	</Link>
																</div>

																<div className="col-md-10" style={{
																	backgroundColor: "#e9e9e9",
																	borderRadius: 10,
																	padding: 20
																}}>
																	{ reply.reply }
																	<br />
																	{ getDate(reply.createdAt) }
																</div>
															</div>
														)
													}) }

												</div>
											</div>
										</div>
									)
								}) }
							</div>

							<form method="POST" id="form-post-comment" onSubmit={doPostComment}>
								<input type="hidden" name="_id" />
								<textarea name="comment" className="form-control emoji" required></textarea>
							</form>
						</div>

						<div className="modal-footer">
							<button type="button" onClick={function () {
								closeModal("postCommentsModal")
							}} className="mtr-btn" data-dismiss="modal">
								<span>Close</span>
							</button>

							<button type="submit" name="submit" form="form-post-comment" className="mtr-btn">
								<span>Post comment</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div id="post-sharers-modal" className="modal">
				<div className="modal-content" style={{
					width: 500
				}}>
					<div className="modal-header">
						<h5 className="modal-title">Post Shares</h5>
						
						<span className="close" onClick={function () {
							closeModal("post-sharers-modal")
						}}>&times;</span>
					</div>

					{ postSharers.map(function (user, index) {
						return (
							<div className="row" style={{
								marginTop: 20
							}} key={`post-sharer-${user._id}-${index}`}>
								<div className="col-md-2">
									<figure>
										<Link to={`/user/${user.username}`} onClick={function () {
											closeModal("post-sharers-modal")
										}}>
											<img src={user.profileImage} />
										</Link>
									</figure>
								</div>

								<div className="col-md-10 pepl-info">
									<h4>
										<Link to={`/user/${user.username}`} onClick={function () {
											closeModal("post-sharers-modal")
										}}>{user.name}</Link>
									</h4>
									<p>{getDate(user.createdAt)}</p>
								</div>
							</div>
						)
					}) }
				</div>
			</div>

			<div className="modal" id="shareInPagesModal" tabIndex="-1" role="dialog" aria-hidden="true">
				<div className="modal-dialog" style={{
					maxWidth: 1000
				}}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Share in pages you manage</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

						<div className="modal-body"></div>
					</div>
				</div>
			</div>

			<div className="modal" id="shareInGroupModal" tabIndex="-1" role="dialog" aria-hidden="true">
				<div className="modal-dialog" style={{
					maxWidth: 1000
				}}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Share in groups</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

						<div className="modal-body"></div>
					</div>
				</div>
			</div>

			<div className="modal" id="replyModal" tabIndex="-1" role="dialog" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Reply</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

						<div className="modal-body">
							<form onSubmit={doPostReply}>
								<input type="hidden" name="postId" />
								<input type="hidden" name="commentId" />
								<textarea name="reply" placeholder="Post your reply"></textarea>
								<button type="submit">Post</button>
							</form>
						</div>
					</div>
				</div>
			</div>

			<div id="edit-post-modal" className="modal">
				<div className="modal-content">
					<h3>Edit post <span className="close" onClick={function () {
						closeModal("edit-post-modal")
					}}>&times;</span></h3>

					<form method="POST" action="/editPost" encType="multipart/form-data" id="form-edit-post" onSubmit={doEditPost}>			
						<input type="hidden" name="_id" />
						<input type="hidden" name="type" />

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
									<button type="submit" name="submit">
										Post
										<i className="fa fa-spinner fa-spin" style={{
											display: 'none'
										}}></i>
									</button>
								</li>
							</ul>
						</div>
					</form>
				</div>
			</div>

		</div>
	)
}

export default Footer