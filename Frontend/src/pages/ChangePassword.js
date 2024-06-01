import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"

import constants from "../constants/constants"
import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import useChangePassword from "../hooks/useChangePassword"

function ChangePassword () {
	const user = useSelector(function (state) {
		return state.user
	})
	const { api } = constants()
	const [coverPhoto, setCoverPhoto] = useState(require("../public/img/default_cover.jpg"))
	const [profileImage, setProfileImage] = useState(require("../public/img/default_profile.jpg"))
	const { changePassword } = useChangePassword()
	const [loading, setLoading] = useState(false)

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
		document.title = "Change Password"
	}, [])

	async function doChangePassword () {
		event.preventDefault()
		setLoading(true)

		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))
		
		const response = await changePassword(formData)
		if (response.status == "error") {
			Swal.fire("Error", response.message, "error")
		} else {
			Swal.fire("Success", response.message, "success")
			form.reset()
		}
		setLoading(false)
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
															Change Password
														</h5>

														<form onSubmit={doChangePassword}>
															
					                                        <div className="form-group">
					                                            <input placeholder="Current Password" type="password" name="current_password" />
					                                            <label className="control-label">Current Password</label>
																<i className="mtrl-select"></i>
					                                        </div>

					                                        <div className="form-group">
					                                            <input placeholder="New Password" type="password" name="new_password" />
					                                            <label className="control-label">New Password</label>
																<i className="mtrl-select"></i>
					                                        </div>

					                                        <div className="form-group">
					                                            <input placeholder="Confirm Password" type="password" name="confirm_password" />
					                                            <label className="control-label">Confirm Password</label>
																<i className="mtrl-select"></i>
					                                        </div>

															<button type="submit" disabled={loading} className="mtr-btn" name="submit">
																{ loading ? (
																	<span>Loading...</span>
																) : (
																	<span>Change Password</span>
																)}
															</button>
														</form>

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
				</>
			)}
		</>
	)
}

export default ChangePassword