import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import $ from "jquery"
import videojs from "video.js"
import NProgress from "nprogress"

import useFetchStory from "../hooks/useFetchStory"
import useStoryViewed from "../hooks/useStoryViewed"
import useDeleteStory from "../hooks/useDeleteStory"
import { isAttachmentImage, getTimePassed } from "../public/js/script.js"

function ViewStory() {
	const [stories, setStories] = useState([])
	const [viewers, setViewers] = useState([])
	const [videoPlayers, setVideoPlayers] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [CSSClasses, setCSSClasses] = useState(["brown", "gray", "white", "green", "blue", "purple", "pink", "red"])
	const [isMyStory, setIsMyStory] = useState(false)
	const [defaultProfile, setDefaultProfile] = useState(
		require("../public/img/default_profile.jpg")
	)
	const { fetchStory } = useFetchStory()
	const { storyViewed } = useStoryViewed()
	const { deleteStory } = useDeleteStory()

	useEffect(function () {
		NProgress.start()
		getData()
	}, [])

	useEffect(function () {
		showStory()
	}, [stories, currentIndex])

	function showStory() {
		// console.trace()
		if (currentIndex >= stories.length) {
			return false;
		}

		markAsViewed(currentIndex);
		const story = stories[currentIndex];

		if (story.attachment != "" && !isAttachmentImage(story.attachment)) {
			// a video
			const index = currentIndex + 1

			$($(".single-bar-fill")[currentIndex]).animate({
				width: "100%"
			}, story.seconds * 1000, function () {
				setCurrentIndex(index)
				var owl = $('#carouselStories').data('owl.carousel');
				if (owl != null) {
					owl.to(index);
				}
			});
		} else {
			$($(".single-bar-fill")[currentIndex]).css({
				"width": "0%"
			});

			$($(".single-bar-fill")[currentIndex]).animate({
				width: "100%"
			}, 10000, function () {
				setCurrentIndex(currentIndex + 1)
				var owl = $('#carouselStories').data('owl.carousel');
				if (owl != null) {
					owl.to(currentIndex + 1);
				}
			});
		}
	}

	async function markAsViewed (index) {
		var formData = new FormData();
		formData.append("accessToken", localStorage.getItem("accessToken"));
		formData.append("_id", stories[index]._id);
		const response = await storyViewed(formData)
		if (response.status == "success") {
			// 
		} else {
			// Swal.fire("Error", response.message, "error");
		}
	}

	function viewViewers (node = null, stories) {
		if (node == null) {
			return
		}

		$(".single-bar-fill").stop();

		const index = parseInt(node.getAttribute("data-index"));
		if (index < stories.length) {
			setViewers(stories[index].viewers)
		}
		$("#storyViewersModal").modal("show");
	}

	async function getData() {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))
		const urlSearchParams = new URLSearchParams(window.location.search)
		formData.append("userId", urlSearchParams.get("id") || "")
		
		const response = await fetchStory(formData)
		if (response.status == "success") {
			setStories(response.stories)
			setIsMyStory(response.isMyStory)

			setTimeout(function () {
				const owl = $("#carouselStories").owlCarousel({
					loop: false,
			        rewind: false,
			        singleItem: true,
			        autoplay: false,
			        dots: false,
			        nav: true,
			        items: 1,
			        touchDrag: false,
			        mouseDrag: false
				});

				owl.on('changed.owl.carousel', function(event) {
					const index = event.item.index
					$(".single-bar-fill").stop();
					setCurrentIndex(index)
				});

				let videoPlayerNodes = document.querySelectorAll(".video-js");
				let tempVideoPlayers = [...videoPlayers]
				for (let a = 0; a < videoPlayerNodes.length; a++) {
					let player = videojs(videoPlayerNodes[a].id);
					tempVideoPlayers.push(player)
				}
				setVideoPlayers(tempVideoPlayers)

				NProgress.done()

				const storyViewers = document.querySelectorAll(".story-viewers");
				for (let a = 0; a < storyViewers.length; a++) {
					storyViewers[a].addEventListener("click", function () {
						viewViewers(this, response.stories);
					});
				}
			}, 500)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function onSubmitDeleteStory () {
		event.preventDefault()
		const form = event.target
		const formData = new FormData(form)
		const _id = formData.get("_id")
		formData.append("accessToken", localStorage.getItem("accessToken"))
		
		$(".single-bar-fill").stop()

		Swal.fire({
			title: "Delete Story",
			text: "Are you sure you want to delete this story ?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Delete it!"
		}).then(async function (result) {
			if (result.isConfirmed) {
				const response = await deleteStory(formData)
				if (response.status == "success") {
					Swal.fire("Success", response.message, "success")

					// setStories((prevStories) =>
					// 	prevStories.filter((story) => story._id !== _id)
					// );

					const tempStories = [...stories]
					let removedIndex = -1
					for (let a = tempStories.length - 1; a >= 0; a--) {
						if (tempStories[a]._id == form._id.value) {
							removedIndex = a
							tempStories.splice(a, 1);
							break;
						}
					}
					setStories(tempStories)

					// Destroy the existing OwlCarousel instance
					$('#carouselStories').trigger('destroy.owl.carousel');

					setTimeout(function () {
						const owl = $("#carouselStories").owlCarousel({
							loop: false,
					        rewind: false,
					        singleItem: true,
					        autoplay: false,
					        dots: false,
					        nav: true,
					        items: 1,
					        touchDrag: false,
					        mouseDrag: false
						});

						owl.on('changed.owl.carousel', function(event) {
							const index = event.item.index
							$(".single-bar-fill").stop();
							setCurrentIndex(index)
						});

						if (removedIndex > -1) {
							showStory()
						}
						
					}, 500)
				} else {
					Swal.fire("Error", response.message, "error")
				}
			}
		})
	}

	function getCSSClass () {
		const cssClass = CSSClasses[Math.floor(Math.random() * CSSClasses.length)];
		return cssClass;
	}

	return (
		<div id="storyApp" style={{
			display: 'contents'
		}}>
			<section>
				<div className="gap1 gray-bg">
					<div className="container-fluid">
						<div className="row" style={{
							backgroundColor: 'black',
							height: '100%'
						}}>
							<div className="offset-md-3 col-md-6">
								<div className="row top-bars" style={{
									marginTop: 10
								}}>
									{ stories.map(function (story, index) {
										return (
											<div className={`col-md-${Math.floor(12 / stories.length)}`} style={{
												paddingLeft: 5,
												paddingRight: 0
											}} key={index}>
												<div className="single-bar">
													<div className="single-bar-fill"></div>
												</div>
											</div>
										)
									}) }
								</div>

								<div className="row">
									<div className="col-md-12" style={{
										marginTop: 20
									}}>
										<div className="owl-carousel owl-theme" id="carouselStories">
											{ stories.map(function (story, index) {
												return (
													<div className="item" key={`story-${story._id}`}>

														{ story.attachment != '' ? (
															<div style={{
																display: "contents"
															}}>

																{ isAttachmentImage(story.attachment) ? (
																	<img className="d-block w-100" src={story.attachment} alt={story.caption} style={{
																		height: 500,
																		objectFit: "contain"
																	}} />
																) : (
																	<video id={`story-video-${story._id}`} 
																		className="video-js"
																		preload="auto"
																		data-setup={`{
																			"controls": true
																		}`}
																		style={{
																			width: "100%",
																			height: 500,
																			objectFit: "cover"
																		}}>
																		<source src={story.attachment}></source>
																		<p className="vjs-no-js">
																		To view this video please enable JavaScript, and consider upgrading to a
																		web browser that
																			<a href="https://videojs.com/html5-video-support/" target="_blank">
																			supports HTML5 video
																			</a>
																		</p>
																	</video>
																) }

																<div>
																    <p style={{
																    	backgroundColor: "black",
																	    color: "white",
																	    padding: 5,
																	    marginBottom: 0
																    }} className="text-center">{story.caption}</p>
																</div>

															</div>
														) : (
															<div style={{
																fontSize: 30,
																width: '100%',
																height: 300,
																textAlign: 'center' 
															}}
																className={getCSSClass}>
														    	<div style={{
														    		position: "relative",
																    top: "50%",
																    transform: "translateY(-50%)"
														    	}}>{story.caption}</div>
														    </div>
														) }
													
														{ isMyStory && (
															<div className="text-center">
														    	<div style={{
														    		display: "contents",
														    		color: "white",
														    		cursor: "pointer"
														    	}} className="story-viewers" data-index={index}>
														    		<i className="fa fa-eye"></i>&nbsp;

														    		<span style={{
														    			fontSize: 12
														    		}}>({story.viewers.length})</span>
														    	</div>

														    	<form onSubmit={onSubmitDeleteStory} style={{
														    		display: "contents"
														    	}}>
														    		<input type="hidden" name="_id" defaultValue={story._id} />
														    		<button type="submit" className="btn btn-link">
														    			<i className="fa fa-trash" style={{
														    				color: "white"
														    			}}></i>
														    		</button>
														    	</form>
														    </div>
														) }

													    <div className="text-center">
													    	{/* v-html="createLikesSection(story)" */}
													    	<div style={{
													    		marginTop: 20
													    	}}></div>
													    </div>

													</div>
												)
											}) }
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{ isMyStory && (
					<div className="modal" id="storyViewersModal">
						<div className="modal-dialog modal-lg" role="document">
							<div className="modal-content">
								<div className="modal-header" style={{
									borderBottom: 0
								}}>
									<h5 className="modal-title">Viewers</h5>

									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>

								<div className="modal-body">
									{ viewers.map(function (viewer, index) {
										return (
											<div className="row" key={index} style={{
												borderTop: "1px solid #e7e7e7",
												paddingTop: 20
											}}>
												<div className="col-3">
													<img src={viewer.user.profileImage} style={{
														width: 100,
														borderRadius: "50%",
														border: "1px solid lightgray"
													}}
														onError={function (event) {
															event.target.src = defaultProfile
														}} />
												</div>

												<div className="col-9">
													<div style={{
														position: "absolute",
														top: "50%",
														transform: "translateY(-50%)"
													}}>
														<p style={{
															fontWeight: "bold",
														    color: "black",
														    marginBottom: 0
														}}>{viewer.user.name}</p>
														<span>{getTimePassed(viewer.createdAt)}</span>
													</div>
												</div>
											</div>
										)
									}) }
								</div>
							</div>
						</div>
					</div>
				) }
			</section>
		</div>
	)
}

export default ViewStory