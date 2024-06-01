import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import constants from "../constants/constants"
import useSignup from "../hooks/useSignup"

function SignupPage () {
	const [loading, setLoading] = useState(false)
	const { api } = constants()
	const navigate = useNavigate()
	const { signup } = useSignup()

	useEffect(function () {
		document.title = "Sign Up"
	}, [])

	async function doRegister() {
		event.preventDefault()
		setLoading(true)
		
		const form = event.target
		const formData = new FormData(form)
		const response = await signup(formData)
		
		if (response.status == "success") {
			Swal.fire("Success", response.message, "success")
				.then(function () {
					navigate("/Login")
				})
		} else {
			Swal.fire("Error", response.message, "error")
		}

		setLoading(false)
	}

	return (
		<div className="container-fluid pdng0">
			<div className="row merged">
				<div className="offset-md-3 col-md-6">
					<div className="login-reg-bg">
						<div className="log-reg-area sign">
							<h2 className="log-title">Signup</h2>

							<form onSubmit={doRegister}>
								<div className="form-group">
									<input type="text" required name="name" />
									<label className="control-label">Full Name</label>
									<i className="mtrl-select"></i>
								</div>

								<div className="form-group">
									<input type="text" required name="username" />
									<label className="control-label">User Name</label>
									<i className="mtrl-select"></i>
								</div>

								<div className="form-group">
									<input type="email" required name="email" />
									<label className="control-label">Email</label>
									<i className="mtrl-select"></i>
								</div>

								<div className="form-group">
									<input type="password" required name="password" />
									<label className="control-label">Password</label>
									<i className="mtrl-select"></i>
								</div>

								<div className="form-radio">
									<div className="radio">
										<label>
											<input type="radio" name="gender" value="Male" defaultChecked />
											<i className="check-box"></i> Male
										</label>
									</div>

									<div className="radio">
										<label>
											<input type="radio" name="gender" value="Female" />
											<i className="check-box"></i> Female
										</label>
									</div>
								</div>

								<Link to="/Login">Already have an account</Link>
								
								<div className="submit-btns">
									<button className="mtr-btn signup" disabled={loading} name="submit" type="submit">
										{loading ? (
											<span>Loading...</span>
										) : (
											<span>Register</span>
										)}
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

export default SignupPage