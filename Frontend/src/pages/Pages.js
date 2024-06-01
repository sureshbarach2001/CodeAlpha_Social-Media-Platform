import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import usePage from "../hooks/usePage"

import Swal from "sweetalert2"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Pages() {
	const { getPages } = usePage()
	const [pages, setPages] = useState([])
	const [ads, setAds] = useState([])
	const [adIndex, setAdIndex] = useState(-1)

	async function onInit() {
		const formData = new FormData()
		formData.append("accessToken", localStorage.getItem("accessToken"))

		const response = await getPages(formData)
		if (response.status == "success") {
			setPages(response.data)
			setAds(response.ads)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	function randomAdIndex() {
		const index = Math.floor(Math.random() * ads.length)
		setAdIndex(index)
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
										<div className="groups">
											<span><i className="fa fa-file-text-o"></i> Your Liked Pages</span>
										</div>

										<ul className="liked-pages" id="all-pages">
											{ pages.map(function (data) {
												return (
													<li key={`page-${data._id}`}>
														{ (Math.floor(Math.random() * 10) < 5 && randomAdIndex() < ads.length && ads.length > adIndex) && (
															<div className="f-page">
																{ ads[adIndex].savedPaths?.length > 0 && (
																	<figure>
																		<img src={ ads[adIndex].savedPaths[0] } style={{
																			width: 205,
																			height: 183,
																			objectFit: "cover"
																		}} />
																		<em>Sponsored</em>
																	</figure>
																) }

																<div className="page-infos">
																	<h5>
																		<Link to={ `/Post/${ads[adIndex]._id}` }>{ ads[adIndex].caption }</Link>
																	</h5>
																	<span>Sponsored</span>
																</div>
															</div>
														) }

														<div className="f-page">
															<figure>
																<Link to={ `/page/${data._id}` }>
																	<img src={ data.coverPhoto } style={{
																		width: 205,
																		height: 183,
																		objectFit: "cover"
																	}} />
																</Link>

																<em>{ data.likers.length } likes</em>
															</figure>

															<div className="page-infos">
																<h5><Link to={`/Page/${data._id}`}>{ data.name }</Link></h5>
																<span>{ data.additionalInfo }</span>
															</div>
														</div>
													</li>
												)
											}) }
										</ul>
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

export default Pages