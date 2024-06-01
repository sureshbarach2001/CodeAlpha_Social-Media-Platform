import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import useBoost from "../hooks/useBoost"
import { getDate } from "../public/js/script.js"

function Ads() {
	const [ads, setAds] = useState([])

	async function onInit() {
		const response = await useBoost.myAds()
		if (response?.status == "success") {
			setAds(response.ads)
		} else {
			Swal.fire("Error", response?.message, "error")
		}
	}

	useEffect(function () {
		onInit()
	}, [])

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

		                                	<h2>My Ads</h2>

		                                	<table className="table table-responsive">
		                                		<thead>
		                                			<tr>
			                                			<th>Post</th>
			                                			<th>Budget</th>
			                                			<th>Where to show ?</th>
			                                			<th>Status</th>
			                                			<th>Gender</th>
			                                			<th>Payment ID</th>
			                                			<th>Started at</th>
			                                			<th>End at</th>
			                                		</tr>
		                                		</thead>

		                                		<tbody id="data">
		                                			{ ads.map(function (ad) {
		                                				return (
		                                					<tr key={`my-ad-${ad._id}`}>
																<td>
																	<Link to={`/PostDetail/${ad.post._id}`}>
																		{ ad.post.caption }
																	</Link>
																</td>
																
																<td>${ ad.budget }</td>
																
																<td>{ ad.whereToShow }</td>
																
																<td>{ ad.status }</td>
																
																<td>{ ad.gender }</td>
																
																<td>
																	<a href={`https://dashboard.stripe.com/test/payments/${ad.paymentId}`} target='_blank'>
																		{ ad.paymentId }
																	</a>
																</td>
																
																<td>{ getDate(ad.createdAt) }</td>
																
																<td>{ getDate(ad.endAt) }</td>
															</tr>
		                                				)
		                                			}) }
		                                		</tbody>
		                                	</table>

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

export default Ads