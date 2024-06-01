import { useEffect } from "react"
import Swal from "sweetalert2"

import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import useGroup from "../hooks/useGroup"

function CreateGroup() {

	async function onSubmitCreateGroup() {
		const form = event.target
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))
		const response = await useGroup.create(formData)
		if (response.status == "success") {
			Swal.fire("Create Group", response.message, "success")
		} else {
			Swal.fire("Error", response.message, "error")
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
										<div className="editing-info">

											<h5 className="f-title">
												<i className="ti-info-alt"></i>
												Create Group
											</h5>

											<form onSubmit={function () {
												event.preventDefault()
												onSubmitCreateGroup()
											}}>

												<div className="form-group">
													<label>Cover photo</label>
													<input type="file" name="coverPhoto" accept="image/*" required />
													<i className="mtrl-select"></i>
												</div>

												<div className="form-group">
													<input type="text" name="name" required />
													<label className="control-label">Group Name</label>
													<i className="mtrl-select"></i>
												</div>

												<div className="form-group">
													<textarea rows="4" name="additionalInfo" required></textarea>
													<label className="control-label">Additional Info</label>
													<i className="mtrl-select"></i>
												</div>

												<button type="submit" className="mtr-btn" name="submit">
													<span>Save</span>
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
	)
}

export default CreateGroup