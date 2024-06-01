import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import usePage from "../hooks/usePage"
import Swal from "sweetalert2"

function CreatePage() {
	const { createPage } = usePage()

	async function onSubmitCreatePage() {
		const form = document.getElementById("form-create-page")
		const formData = new FormData(form)
		formData.append("accessToken", localStorage.getItem("accessToken"))

		const response = await createPage(formData)

		if (response.status == "error") {
			Swal.fire("Error", response.message, "error")
		} else if (response.status == "success") {
			Swal.fire("Success", response.message, "success")

			form.name.value = ""
			form.domainName.value = ""
			form.additionalInfo.value = ""
			form.coverPhoto.value = null
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
												Create Page
											</h5>

											<form onSubmit={ function () {
												event.preventDefault()
												onSubmitCreatePage()
											} } id="form-create-page">

												<div className="form-group">
													<label>Cover photo</label>
													<input type="file" name="coverPhoto" accept="image/*" required />
													<i className="mtrl-select"></i>

													<br /><br />
												</div>

												<div className="form-group">
													<input type="text" name="name" required />
													<label className="control-label">Page Name</label>
													<i className="mtrl-select"></i>

													<br /><br />
												</div>

												<div className="form-group">
													<input type="text" name="domainName" />
													<label className="control-label">www.yourdomain.com</label>
													<i className="mtrl-select"></i>

													<br /><br />
												</div>

												<div className="form-group">
													<textarea rows="4" name="additionalInfo" required></textarea>
													<label className="control-label">Additional Info</label>
													<i className="mtrl-select"></i>

													<br /><br />
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

export default CreatePage