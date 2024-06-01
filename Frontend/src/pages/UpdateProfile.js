import { useState, useEffect, lazy } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import Swal from "sweetalert2"
import constants from "../constants/constants"
import useCoverPhoto from "../hooks/useCoverPhoto"
import useProfileImage from "../hooks/useProfileImage"
import useUpdateProfile from "../hooks/useUpdateProfile"
import useDeleteAccount from "../hooks/useDeleteAccount"

const LeftSidebar = lazy(function () {
	return import ("./includes/LeftSidebar")
})

const RightSidebar = lazy(function () {
	return import ("./includes/RightSidebar")
})

function UpdateProfile () {
	const [coverPhoto, setCoverPhoto] = useState(require("../public/img/default_cover.jpg"))
	const [profileImage, setProfileImage] = useState(require("../public/img/default_profile.jpg"))
	const [updating, setUpdating] = useState(false)
	const user = useSelector(function (state) {
		return state.user
	})
	const dispatch = useDispatch()
	const { api } = constants()
	const { upload } = useCoverPhoto()
	const { uploadProfileImage } = useProfileImage()
	const { updateProfile } = useUpdateProfile()
	const { deleteAccount } = useDeleteAccount()
	const navigate = useNavigate()

	useEffect(function () {
		if (user != null) {
			if (user.coverPhoto) {
				setCoverPhoto(api + "/" + user.coverPhoto)
			}

			if (user.profileImage) {
				setProfileImage(api + "/" + user.profileImage)
			}
		}
	}, [user])

	useEffect(function () {
		document.title = "Update Profile"
	}, [])

	async function onClickUploadCoverPhoto () {
		const form = document.getElementById("form-cover-photo")
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"));
		const response = await upload(formData)

		if (response.status == "success") {
			setCoverPhoto(response.data)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	async function uploadImage () {
		const form = document.getElementById("form-upload-image")
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"));
		const response = await uploadProfileImage(formData)

		if (response.status == "success") {
			setProfileImage(response.data)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	async function doUpdateProfile () {
		event.preventDefault()
		setUpdating(true)

		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"));
		const response = await updateProfile(formData)

		if (response.status == "success") {
			Swal.fire("Success", response.message, "success")

			const tempUser = Object.assign({}, user)
			tempUser.name = form.name.value
			tempUser.dob = form.dob.value
			tempUser.city = form.city.value
			tempUser.country = form.country.value
			tempUser.aboutMe = form.aboutMe.value
			tempUser.profileLocked = form.profileLocked.checked ? "yes" : "no"

			dispatch({
				type: "updateUser",
				user: tempUser
			})
		} else {
			Swal.fire("Error", response.message, "error")
		}

		setUpdating(false)
	}

	function onClickDeleteAccount () {
		Swal.fire({
			title: "Please enter your password for verification",
			input: "password",
			inputAttributes: {
				autocapitalize: "off",
				autocorrect: "off",
				autocomplete: "off"
			},
			inputLabel: "Password",
			inputPlaceholder: "Enter your password",
			showCancelButton: true,
			confirmButtonText: "Delete Account",
			showLoaderOnConfirm: true
		})
		.then(function (input) {
			if (!input) throw null

			if (input.isConfirmed) {
				return new Promise(async function (callback) {
					const formData = new FormData()
					formData.append("accessToken", localStorage.getItem("accessToken"))
					formData.append("password", input.value)
					const response = await deleteAccount(formData)

					Swal.hideLoading()
					Swal.close()

					if (response.status == "success") {
						Swal.fire("Delete account", response.message, "success")
							.then(function () {
								localStorage.removeItem("accessToken")
								navigate("/Login")
							})
					} else {
						Swal.fire("Error", response.message, "error")
					}
				})
			}
			
		})
		.catch(function (err) {
			if (err) {
				Swal.fire("Error!", err, "error")
			} else {
				Swal.hideLoading()
				Swal.close()
			}
		})
	}

	return (
		<>
			{user != null && (
				<>
					<section>
						<div className="feature-photo">

							<figure>
								<img className="cover-photo" id="cover-photo" style={{
									width: "100%",
									height: 700,
									objectFit: "cover"
								}}
								src={coverPhoto} />
							</figure>

							<form className="edit-phto" id="form-cover-photo" encType="multipart/form-data">
								<i className="fa fa-camera-retro"></i>
								<label className="fileContainer">
									Edit Cover Photo
									<input type="file" accept="image/*" name="coverPhoto" onChange={onClickUploadCoverPhoto} required />
								</label>
							</form>

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
												src={profileImage} />

												<form className="edit-phto" encType="multipart/form-data" id="form-upload-image">
													<i className="fa fa-camera-retro"></i>
													<label className="fileContainer">
														Edit Display Photo
														<input type="file" accept="image/*" name="profileImage" onChange={uploadImage} required />
													</label>
												</form>
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
													}}>{user.name}</h5>
												</li>

					                            <li><Link to="/profileViews">Profile Views</Link></li>
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
												<LeftSidebar />
											</div>

											<div className="col-md-6">
												<div className="central-meta">
													<div className="editing-info">

														<h5 className="f-title">
															<i className="ti-info-alt"></i>
															&nbsp;Update Profile
														</h5>

														<form onSubmit={doUpdateProfile} style={{
															marginBottom: 20
														}}>
															<div className="form-group">
																<input type="text" defaultValue={user.name} required className="name" name="name" />
																<label className="control-label">Full Name</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div className="form-group">
																<input className="email" defaultValue={user.email} readOnly />
																<label className="control-label">Email</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div className="form-group">
																<input type="text" className="dob" defaultValue={user.dob} name="dob" placeholder="DD/MM/YYYY" />
																<label className="control-label">Date of birth</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div className="form-group">	
																<input type="text" className="city" defaultValue={user.city} name="city" />
																<label className="control-label">City</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div className="form-group">
																<input type="text" className="country" defaultValue={user.country} name="country" />
																<label className="control-label">Country</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div className="form-group">	
																<textarea rows="4" className="aboutMe" defaultValue={user.aboutMe} name="aboutMe"></textarea>
																<label className="control-label">About Me</label>
																<i className="mtrl-select"></i>
															</div>

															<br /><br />

															<div>
																<label>
																	<input type="checkbox" defaultChecked={user.profileLocked == 'yes'} name="profileLocked" value="yes" />
																	&nbsp;Lock profile
																</label>
															</div>

															<button type="submit" className="mtr-btn" disabled={updating} name="submit">
																{updating ? (
																	<span>Updating...</span>
																) : (
																	<span>Save</span>
																)}
															</button>
														</form>

														<p>
															<Link to="/ChangePassword">Change Password</Link>
														</p>

														<p>
															<button type="button" className="btn btn-block btn-danger" onClick={onClickDeleteAccount}>Delete Account</button>
														</p>

													</div>
												</div>
											</div>

											<div className="col-md-3">
												<aside className="sidebar static">
													<div className="widget">
														<h4 className="widget-title">
															<Link {... {
																to: "/user/" + user.username
															} } id="link-my-public-profile">
																My Public Profile
															</Link>
														</h4>
													</div>
												</aside>

												<RightSidebar />
											</div>

										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</>
			)}			
		</>
	)
}

export default UpdateProfile