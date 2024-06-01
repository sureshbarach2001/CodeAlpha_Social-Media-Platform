import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const RightSidebar = function () {
	const user = useSelector(function (state) {
		return state.user
	})

	return (
		<aside className="sidebar" style={{
			position: "sticky",
			top: 100
		}}>
			<div className="widget">
				<h4 className="widget-title">Your pages</h4>

				<div id="my-pages">
					{ user != null && (
						<>
							{ user.pages.map(function (data) {
								return (
									<div className="your-page" key={`my-page-${data._id}`}>
										<figure>
											<Link to={`/page/${data._id}`}>
												<img src={ data.coverPhoto } />
											</Link>
										</figure>

										<div className="page-meta">
											<Link to={`/Page/${data._id}`} className="underline">{ data.name }</Link>
										</div>

										<div className="page-likes">
											<ul className="nav nav-tabs likes-btn">
												<li className="nav-item" style={{
													width: "100%"
												}}>
													<a className="active" href="#page-likes" data-toggle="tab">likes</a>
												</li>
											</ul>

											<div className="tab-content">
												<div className="tab-pane active fade show " id="page-likes" >
													<span><i className="ti-heart"></i>{ data.likers.length }</span>

													<div className="users-thumb-list">
														{ data.likers.map(function (liker, likerIndex) {
															return (
																<Link to={`/User/${liker._id}`} data-toggle="tooltip"
																	key={`my-page-liker-${liker._id}`}>
																	<img src={ liker.profileImage } style={{
																		width: 32,
																		height: 32,
																		objectFit: "cover"
																	}} />
																</Link>
															)
														}) }
													</div>

												</div>
											</div>
										</div>
									</div>
								)
							}) }
						</>
					) }
				</div>
			</div>
		</aside>
	)
}

export default RightSidebar