import "../../public/css/main.min.css"
import "../../public/css/style.css"
import "../../public/css/color.css"
import "../../public/css/responsive.css"
import "../../public/css/bootstrap.min.css"
import "../../public/css/owl.carousel.min.css"
import "../../public/css/owl.theme.default.min.css"
import "../../public/wysiwyg/css/froala_editor.css"
import "../../public/wysiwyg/css/plugins/image.min.css"
import "../../public/wysiwyg/css/plugins/video.min.css"
import "../../public/video-js/video-js.min.css"
import "../../public/wavesurfer/videojs.wavesurfer.min.css"
import "../../public/js/popper.min.js"
import "../../public/js/bootstrap.min.js"
import "../../public/js/owl.carousel.min.js"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useSelector, useDispatch } from "react-redux"

import constants from "../../constants/constants"
import useLogout from "../../hooks/useLogout"
import useGetUser from "../../hooks/useGetUser"

function Header() {
	const { api } = constants()
	const [loading, setLoading] = useState(false)
	const [loggingOut, setLoggingOut] = useState(false)
	const user = useSelector(function (state) {
		return state.user
	})
	const [search, setSearch] = useState("")
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { doLogout } = useLogout()
	const { getUser } = useGetUser()

	async function onClickLogout () {
		setLoggingOut(true)
		const response = await doLogout()

		if (response.status == "success") {
			dispatch({
				type: "updateUser",
				user: null
			})

			localStorage.removeItem("accessToken")
			navigate("/Login")
		} else {
			Swal.fire("Error", response.message, "error")
		}
		
		setLoggingOut(false)
	}

	async function fetchUser () {
		if (localStorage.getItem("accessToken")) {
			setLoading(true)
			const response = await getUser()
			if (response.status == "success") {
				dispatch({
					type: "updateUser",
					user: response.data
				})
			}
			setLoading(false)
		}
	} 

	useEffect(function () {
		fetchUser()
	}, [])

	function onSearch() {
		event.preventDefault()
		document.querySelector(".searched.active").className = "searched"
		navigate("Search/" + search)
	}

	function keypressInBox() {
		// 
	}

	return (
		<div>
			<div className="responsive-header">
				<div className="mh-head first Sticky">
					<span className="mh-btns-left">
						<a className="" href="#menu"><i className="fa fa-align-justify"></i></a>
					</span>
					<span className="mh-text">
						<Link to="/" title="">
							Social Network
						</Link>
					</span>
				</div>
				<div className="mh-head second">
					<input type="search" value={ search }
						onChange={function () {
							setSearch(event.target.value)
						}}
						placeholder="Search Users, Pages or Groups" />
				</div>
				<nav id="menu" className="res-menu">
					{ user == null ? (
						<ul id="main-menu-mobile">
							<li>
								<Link to="/Login">Login <i className="fa fa-angle-right"></i></Link>
							</li>

							<li>
								<Link to="/Signup">Signup <i className="fa fa-angle-right"></i></Link>
							</li>
						</ul>
					) : (
						<>

						</>
					) }
				</nav>
			</div>

			<div className="topbar stick">
				<div className="logo">
					<Link to="/" style={{
						fontSize: 28,
						bottom: 3,
						position: 'relative' 
					}}>
						Social Network
					</Link>
				</div>

				<div className="top-area">
					<ul className="main-menu" id="main-menu">
						{ user == null ? (
							<>
								<li>
									<Link to="/Login">Login <i className="fa fa-angle-right"></i></Link>
								</li>

								<li>
									<Link to="/Signup">Signup <i className="fa fa-angle-right"></i></Link>
								</li>
							</>
						) : (
							<>
								<li>
									<Link to="/Ads">My Ads</Link>
								</li>

								<li>
									<Link to="/Friends">Friends <i className="fa fa-angle-right"></i></Link>
								</li>

								<li>
									<Link to="/Pages">Pages <i className="fa fa-angle-right"></i></Link>
								</li>

								<li>
									<Link to="/Groups">Groups <i className="fa fa-angle-right"></i></Link>
								</li>

								<li>
									<Link to="/UpdateProfile">Profile ({user.name}) <i className="fa fa-angle-right"></i></Link>
								</li>

								<li>
									<a href="#" onClick={onClickLogout} disabled={loggingOut}>{loggingOut ? 'Logging out...' : 'Logout'}</a>
								</li>
							</>
						) }
					</ul>

					<ul className="setting-area" style={{
						marginTop: 20
					}}>

						<li>
							<Link to="#">
								<i className="ti-search"></i>
							</Link>
							<div className="searched">
								<form style={{
									display: "block"
								}}
									className="form-search"
									onSubmit={ onSearch }>
									<input type="search"
										value={ search }
										onChange={function () {
											setSearch(event.target.value)
										}}
										placeholder="Search Users, Pages or Groups" />
								</form>
							</div>
						</li>

					</ul>

				</div>
			</div>
		</div>
	)
}

export default Header