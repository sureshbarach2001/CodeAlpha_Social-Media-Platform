import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"

import useGroup from "../hooks/useGroup"
import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"

function EditGroup() {
	const { id } = useParams()
	const [group, setGroup] = useState(null)
	const user = useSelector(function (state) {
		return state.user
	})

	async function onInit() {
		const formData = new FormData()
		formData.append("_id", id)

		const response = await useGroup.fetchSingle(formData)
		if (response.status == "success") {
			setGroup(response.group)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	async function editGroup() {
		const form = event.target
		const formData = new FormData(form)
		formData.append("_id", id)
		formData.append("accessToken", localStorage.getItem("accessToken"))

		const response = await useGroup.update(formData)
		if (response.status == "success") {
			Swal.fire("Update Group", response.message, "success")
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	useEffect(function () {
		onInit()
	}, [])

	return (
		<section>
			{ group != null && (
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
			                                        Edit Group
			                                    </h5>

			                                    <form onSubmit={function () {
			                                    	event.preventDefault()
			                                    	editGroup()
			                                    }}>
			                                        <div className="form-group">
			                                            <label>Cover Photo</label>
			                                            <input type="file" name="coverPhoto" id="coverPhoto" accept="image/*" />
			                                            <i className="mtrl-select"></i>

			                                            <img id="cover-photo" src={ group.coverPhoto } />
			                                        </div>

			                                        <div className="form-group">
			                                            <input type="text" name="name" required defaultValue={ group.name } />
			                                            <label className="control-label">Group Name</label>
			                                            <i className="mtrl-select"></i>
			                                        </div>

			                                        <div className="form-group">
			                                            <textarea rows="4" name="additionalInfo" required defaultValue={ group.additionalInfo }></textarea>
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
			) }
		</section>
	)
}

export default EditGroup