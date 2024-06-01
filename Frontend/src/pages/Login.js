import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import constants from "../constants/constants"
import useUpdateKeys from "../hooks/useUpdateKeys"
import useLogin from "../hooks/useLogin"

function LoginPage () {
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState("")
	const { api } = constants()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { updateKeys } = useUpdateKeys()
	const { login } = useLogin()

	useEffect(function () {
		document.title = "Login"
	}, [])

	async function doUpdateKeys () {
		const keyPair = await window.crypto.subtle.generateKey(
			{
				name: "ECDH",
				namedCurve: "P-256",
			},
			true,
			["deriveKey", "deriveBits"]
		)

		const publicKeyJwk = await window.crypto.subtle.exportKey(
			"jwk",
			keyPair.publicKey
		)

		const privateKeyJwk = await window.crypto.subtle.exportKey(
			"jwk",
			keyPair.privateKey
		)

		setLoading(true)
		const response = await updateKeys(email, JSON.stringify(publicKeyJwk), JSON.stringify(privateKeyJwk))
		if (response.status == "success") {
			if (response.profileImage == "") {
				navigate("/UpdateProfile")
			} else {
				navigate("/")
			}
		} else {
			Swal.fire("Error", response.message, "error")
		}
		setLoading(false)
	}

	async function doLogin () {
		event.preventDefault()
		const form = event.target
		const formData = new FormData(form)

		setLoading(true)
		const response = await login(formData)
		if (response.status == "success") {
			const accessToken = response.accessToken
			localStorage.setItem("accessToken", accessToken)

			dispatch({
				type: "updateUser",
				user: response.data
			})

			if (response.hasKey) {
				setLoading(false)
				if (response.profileImage == "") {
					navigate("/UpdateProfile")
				} else {
					navigate("/")
				}
			} else {
				doUpdateKeys()
			}
		} else {
			Swal.fire("Error", response.message, "error")
			setLoading(false)
		}
	}

	return (
		<div className="container-fluid pdng0">
			<div className="row merged">
				<div className="offset-md-3 col-md-6">
					<div className="login-reg-bg">
						<div className="log-reg-area sign">
							<h2 className="log-title">Login</h2>

							<form onSubmit={doLogin}>

								<div className="form-group">
									<input type="email"
										value={email}
										onChange={function (event) {
											setEmail(event.target.value)
										}}
										required name="email" id="email" />
									<label className="control-label">Email</label><i className="mtrl-select"></i>
								</div>

								<div className="form-group">
									<input type="password" required name="password" />
									<label className="control-label">Password</label><i className="mtrl-select"></i>
								</div>

								<p>
									<Link to="/Signup">Don't have an account ?</Link>
								</p>

								<p>
									<Link to="/ForgotPassword">Forgot password ?</Link>
								</p>

								<div className="submit-btns">
									<button className="mtr-btn login" disabled={loading} name="submit" type="submit">
										{loading ? (
											<span>Loading...</span>
										) : (
											<span>Login</span>
										) }
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginPage