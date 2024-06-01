import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

import useAddStory from "../hooks/useAddStory"

function AddStory () {
	const [stories, setStories] = useState([])
	const [adding, setAdding] = useState(false)
	const user = useSelector(function (state) {
		return state.user
	})
	const { addStory } = useAddStory()
	const navigate = useNavigate()

	useEffect(function () {
		onClickAddMore()
	}, [])

	async function onSubmitAddStory () {
		event.preventDefault()
		setAdding(true)
		
		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))
		formData.append("length", stories.length)
		
		const response = await addStory(formData)
		if (response.status == "error") {
			Swal.fire("Error", response.message, "error")
		} else if (response.status == "success") {
			Swal.fire("Success", response.message, "success")
				.then(function () {
					navigate("/")
				})
		}

		setAdding(false)
	}

	function onClickAddMore () {
		setStories(function (prevStories) {
			return [...prevStories, {
				attchment: "",
				caption: ""
			}]
		})
	}

	const updateCaption = function (index, value) {
		const tempStories = [...stories]
		tempStories[index].caption = value
		setStories(tempStories)
	}

	function removeStory (index) {
		const tempStories = [...stories]
		tempStories.splice(index, 1)
		setStories(tempStories)
	}

	return (
		<>
			{user != null && (
				<section id="addStoryApp">

					<form onSubmit={onSubmitAddStory} id="form-add-story" encType="multipart/form-data">
					</form>

					<div className="gap gray-bg">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<div className="central-meta">
										<div className="editing-info">
											<h5 className="f-title">
												<i className="ti-info-alt"></i>
												Add Story
											</h5>
										</div>
									</div>
								</div>
							</div>
						</div>

						{ stories.map(function (story, index) {
							return (
								<div className="container" key={index}>
									<div className="row">
										<div className="col-md-12">
											<div className="central-meta">
												<div className="editing-info">
													<div className="row">
														<div className="offset-md-6 col-md-3">
															<h3 style={{
																background: "#0a8dcd",
															    color: "white",
															    display: "initial",
															    padding: "10px 20px",
															    borderRadius: "50%"
															}}>{index + 1}</h3>
														</div>

														<div className="col-md-3">
															<button type="button" className="btn btn-danger btn-sm pull-right" onClick={function () {
																removeStory(index)
															}}>x</button>
														</div>
													</div>

													<div className="form-group">
														<label>Add Attachment</label>
														<input type="file" accept="image/*, video/*" form="form-add-story" name={`attachment${index}`} />
														<i className="mtrl-select"></i>

														<br /><br />
													</div>

													<div className="form-group">
														<textarea rows="4" form="form-add-story" name={`caption${index}`} onChange={function (event) {
															updateCaption(index, event.target.value)
														}} value={story.caption}></textarea>
														<label className="control-label">Caption</label>
														<i className="mtrl-select"></i>

														<br /><br />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						}) }

						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<div className="central-meta">
										<div className="editing-info">

											<button type="button" className="btn btn-primary" style={{
												position: "relative",
												left: "50%",
												transform: "translateX(-50%)"
											}}
											onClick={onClickAddMore}>+ Add</button>

										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<div className="central-meta">
										<div className="editing-info">

											<button type="submit" className="mtr-btn" disabled={adding} name="submit" form="form-add-story">
												{adding ? (
													<span>Adding...</span>
												) : (
													<span>Add Story</span>
												)}
											</button>

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	)
}

export default AddStory