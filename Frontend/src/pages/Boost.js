import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"

import LeftSidebar from "./includes/LeftSidebar"
import RightSidebar from "./includes/RightSidebar"
import SinglePost from "./includes/SinglePost"
import useBoost from "../hooks/useBoost"
import constants from "../constants/constants"
import "https://js.stripe.com/v3/"

function Boost() {
	const { id } = useParams()
	const [post, setPost] = useState(null)
	const [budget, setBudget] = useState(1)
	const [showBtnPay, setShowBtnPay] = useState(false)
	const [isPaying, setIsPaying] = useState(false)
	const [stripe, setStripe] = useState(null)
	const [cardElement, setCardElement] = useState(null)
	const { stripePublicKey } = constants()
	const navigate = useNavigate()

	const user = useSelector(function (state) {
		return state.user
	})

	async function onInit() {
		const response = await useBoost.fetchPost(id)
		if (response.status == "success") {
			setPost(response.post)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	useEffect(function () {
		onInit()
	}, [])

	function showPaymentUI() {
		setShowBtnPay(false)

		const whereToShowNodes = document.querySelectorAll("input[name=whereToShow]:checked")
		if (whereToShowNodes.length == 0) {
			Swal.fire("No place selected", "Please select any place to put ad.", "error")
			return
		}

		const tempStripe = Stripe(stripePublicKey)
        const elements = tempStripe.elements()
        const tempCardElement = elements.create('card')
        tempCardElement.mount('#stripe-card-element')

		setStripe(tempStripe)
		setCardElement(tempCardElement)
        setShowBtnPay(true)
	}

	async function createPaymentIntent() {
		if (user == null) {
			Swal.fire("Error", "User is not logged-in", "error")
			return
		}

		setIsPaying(true)
		const response = await useBoost.createStripeIntent(budget)
		if (response.status == "success") {
			const clientSecret = response.clientSecret

			// execute the payment
		    stripe
		        .confirmCardPayment(clientSecret, {
		            payment_method: {
		                    card: cardElement,
		                    billing_details: {
		                        name: user.name,
		                        email: user.email
		                    },
		                },
		            })
		            .then(async function(result) {
		 
		                // Handle result.error or result.paymentIntent
		                if (result.error) {
		                    console.log(result.error)
		                    
		                    Swal.fire("Error", result.error, "error")
		                    setIsPaying(false)
		                } else {
		                    // console.log("The card has been verified successfully...", result.paymentIntent.id)

							const budget = document.getElementById("budget").value
		                    const gender = document.querySelector("input[name='gender']:checked").value
							const whereToShowNodes = document.querySelectorAll("input[name=whereToShow]:checked")

							const whereToShow = []
							for (let a = 0; a < whereToShowNodes.length; a++) {
								whereToShow.push(whereToShowNodes[a].value)
							}
		 
		 					const boostPostResponse = await useBoost.boostPost(budget, gender, whereToShow, id, result.paymentIntent.id)
		 					if (boostPostResponse.status == "success") {
		 						Swal.fire("Boost Post", response.message, "success")
									.then(function () {
										navigate("/Ads")
									})
		 					} else {
		 						Swal.fire("Error", boostPostResponse.message, "error")
		 					}
		                }
		            })
		} else {
			Swal.fire("Error", response.message, "error")
			setIsPaying(false)
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
		                                	{ post != null && (
		                                		<div id="post-detail">
			                                    	<SinglePost data={ post } />

			                                    	<h3>$1 per day</h3>

			                                    	<label>
														Select budget (1 to 1000 USD)
														<input type="range" id="budget" name="budget" min="1" max="1000" step="1"
															value={ budget }
															onChange={function () {
																setBudget(event.target.value)
															}} />
														<span id="lblBudget">${ budget }</span>
													</label>

													<hr />

													<div>
														<p>Where you want to advertise ?</p>

														<label>
															<input type="checkbox" name="whereToShow" value="newsfeed" />
															&nbsp;Newsfeed
														</label>

														&nbsp;<label>
															<input type="checkbox" name="whereToShow" value="pages" />
															&nbsp;Pages
														</label>

														&nbsp;<label>
															<input type="checkbox" name="whereToShow" value="groups" />
															&nbsp;Groups
														</label>

														&nbsp;<label>
															<input type="checkbox" name="whereToShow" value="chat" />
															&nbsp;Chat
														</label>
													</div>

													<div>
														<label>
															<input type="radio" name="gender" value="Male" />
															&nbsp;Male
														</label>

														&nbsp;<label>
															<input type="radio" name="gender" value="Female" />
															&nbsp;Female
														</label>

														&nbsp;<label>
															<input type="radio" name="gender" value="both" defaultChecked />
															&nbsp;both
														</label>
													</div>

													<button type="button" style={{
														backgroundColor: "#088dcd",
														color: "white",
														padding: 5,
														border: "none"
													}} onClick={function () {
														showPaymentUI()
													}}>Boost Post</button>

													<div id="stripe-card-element" style={{
														marginTop: 50,
														marginBottom: 20
													}}></div>

													{ showBtnPay && (
														<button type="button" id="btnPayNow" style={{
															backgroundColor: "#088dcd",
															color: "white",
															padding: 5,
															border: "none"
														}}
															onClick={function () {
																createPaymentIntent()
															}}
															disabled={ isPaying }>{ isPaying ? "Loading..." : "Pay Now" }</button>
													) }
			                                    </div>
		                                	) }
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

export default Boost