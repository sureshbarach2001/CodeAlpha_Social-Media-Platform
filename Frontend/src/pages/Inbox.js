import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"

import "../public/css/chat.css"
import { getDate } from "../public/js/script.js"
import hooks from "../utils/hooks"

function Inbox() {
	const [selectedFriend, setSelectedFriend] = useState(null)
	const user = useSelector(function (state) {
		return state.user
	})
	const [friends, setFriends] = useState([])
	const [messages, setMessages] = useState([])
	const [derivedKey, setDerivedKey] = useState(null)
	const [publicKey, setPublicKey] = useState("")
	const [privateKey, setPrivateKey] = useState("")
	const [message, setMessage] = useState("")

	async function sendMessage() {
		if (selectedFriend == null) {
			Swal.fire("Error", "Please select a friend.", "error")
			return
		}

		let tempPublicKey = publicKey
		let tempPrivateKey = privateKey

		if (tempPublicKey == "" && tempPrivateKey == "") {
			const response = await hooks.getKeys(selectedFriend._id)
			if (response.status == "success") {
				tempPublicKey = response.publicKey
				tempPrivateKey = response.privateKey
			} else {
				Swal.fire("Error", response.message, "error")
				return
			}
		}

		const derivedKey = await getDerivedKey(tempPrivateKey, tempPublicKey)
		const encodedText = new TextEncoder().encode(message)
		const iv = new TextEncoder().encode(new Date().getTime())
		const encryptedData = await window.crypto.subtle.encrypt(
			{ name: "AES-GCM", iv: iv },
			derivedKey,
			encodedText
		)
		const uintArray = new Uint8Array(encryptedData)
		const string = String.fromCharCode.apply(null, uintArray)
		const base64Data = btoa(string)
		const b64encodedIv = btoa(new TextDecoder("utf8").decode(iv))

		const form = document.getElementById("form-send-message")
		const responseSendMessage = await hooks.sendMessage(selectedFriend._id, base64Data, b64encodedIv, form)
		if (responseSendMessage.status == "success") {
			const tempMessages = [...messages]
			tempMessages.push(responseSendMessage.data)
			setMessage("")
			
			for (const m of tempMessages) {
				m.content = ""
				if (m.message) {
					m.content = await getMessageContent(m, derivedKey)
				}
			}
			setMessages(tempMessages)
		} else {
			Swal.fire("Error", responseSendMessage.message, "error")
		}
	}

	async function friendSelected(friend) {
		if (friend == null) { return }

		setSelectedFriend(friend)
		const response = await hooks.getFriendsChat(friend._id)
		if (response.status == "success") {
			const privateKey = response.privateKey
			const publicKey = response.publicKey
			const derivedKey = await getDerivedKey(privateKey, publicKey)
			setDerivedKey(derivedKey)
			setPublicKey(publicKey)
			setPrivateKey(privateKey)

			for (const m of response.data) {
				m.content = ""
				if (m.message) {
					m.content = await getMessageContent(m, derivedKey)
				}
			}
			setMessages(response.data)
		} else {
			Swal.fire("Error", response.message, "error")
		}
	}

	useEffect(function () {
		if (user != null) {
			setFriends(user.friends || [])
		}
	}, [user])

	async function getDerivedKey(privateKey, publicKey) {
		const publicKeyObj = await window.crypto.subtle.importKey(
			"jwk",
			publicKey,
			{
				name: "ECDH",
				namedCurve: "P-256",
			},
			true,
			[]
		)

		const privateKeyObj = await window.crypto.subtle.importKey(
			"jwk",
			privateKey,
			{
				name: "ECDH",
				namedCurve: "P-256",
			},
			true,
			["deriveKey", "deriveBits"]
		)

		const derivedKey = await window.crypto.subtle.deriveKey(
			{ name: "ECDH", public: publicKeyObj },
			privateKeyObj,
			{ name: "AES-GCM", length: 256 },
			true,
			["encrypt", "decrypt"]
		)

		return derivedKey
	}

	async function getMessageContent(m, derivedKey) {
		if (typeof m.voiceNote === "undefined" && !m.is_deleted && derivedKey != null) {
			const iv = new Uint8Array(atob(m.iv).split("").map(function(c) {
	            return c.charCodeAt(0)
	        }))
	        const initializationVector = new Uint8Array(iv).buffer
	        const string = atob(m?.message || "")
	        const uintArray = new Uint8Array(
	            [...string].map((char) => char.charCodeAt(0))
	        )
	        const decryptedData = await window.crypto.subtle.decrypt(
	            {
	                name: "AES-GCM",
	                iv: initializationVector,
	            },
	            derivedKey,
	            uintArray
	        )
	        return new TextDecoder().decode(decryptedData)
		}
		return ""
	}

	return (
		<>
			<section>
				<div className="gap gray-bg">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<div className="central-meta">
									<div className="messaging">
										<div className="inbox_msg">
											<div className="inbox_people">
												<div className="headind_srch">
													<div className="recent_heading">
														<h4>Friends</h4>
													</div>
												</div>

												<div className="inbox_chat">
													<div id="sponsoredLayout" style={{
														margin: 20
													}}></div>
													<div id="friends">
														{ friends.map(function (friend) {
															return (
																<div style={{
																	display: "contents"
																}}
																	key={`friend-${friend._id}`}>
																	{ friend.status == "Accepted" && (
																		<div className={`chat_list ${selectedFriend?._id == friend._id ? "active" : ""}`} onClick={function () {
																			friendSelected(friend)
																		}} style={{
																			cursor: "pointer"
																		}}>
																			<div className="chat_people">
																				<div className="chat_img">
																					<img src={ friend.profileImage } onError={function () {
																						event.target.src = require("../public/img/default_profile.jpg")
																					}} />
																				</div>

																				<div className="chat_ib">
																					<h5>
																						{ friend.name }
																						{ (friend.unread && friend.unread > 0) && (
																							<span className="badge unread" style={{
																								backgroundColor: "#05728f",
																								color: "white"
																							}}>{ friend.unread }</span>
																						) }
																					</h5>
																				</div>
																			</div>
																		</div>
																	) }
																</div>
															)
														}) }
													</div>
												</div>
											</div>

											<div className="mesgs">
												<div className="msg_history" id="msg_history" style={{
													clear: "both"
												}}>
													{ messages.map(function (message) {
														return (
															<div style={{
																display: "contents"
															}} key={`message-${message._id}`}>
																{ message.from == user?._id ? (
																	<div className="outgoing_msg" data-message-id={ message._id }>
																		<div className="sent_msg">
																			<p>{ message.content }</p>
																			<span className="time_date">{ getDate(message.createdAt) }</span>

																			{ message.is_deleted && (
																				<i className='fa fa-trash pull-right' onClick={function () {
																					deleteMessage(message._id)
																				}}></i>
																			) }

																		</div>
																	</div>
																) : (
																	<div className="incoming_msg" data-message-id={ message._id }>
																		<div className="received_msg">
																			<div class="received_withd_msg">
																				<p>{ message.content }</p>
																				<span className="time_date">{ getDate(message.createdAt) }</span>
																			</div>

																			{ message.is_deleted && (
																				<i className='fa fa-trash pull-right' onClick={function () {
																					deleteMessage(message._id)
																				}}></i>
																			) }

																		</div>
																	</div>
																) }
															</div>
														)
													}) }
												</div>

												<div className="type_msg">
													<div className="input_msg_write">
														<form method="post" onSubmit={function () {
															event.preventDefault()
															sendMessage()
														}} encType="multipart/form-data" style={{
															display: "contents"
														}} id="form-send-message">
															<input type="text" name="message" className="write_msg" id="message" placeholder="Type a message"
																value={ message }
																onChange={function () {
																	setMessage(event.target.value)
																}} />

															<div className="attachments" style={{
																display: "flex",
																paddingRight: 0,
																paddingLeft: 0,
																border: "none"
															}}>
																<ul>
																	<li>
																		<input type="file" name="files" multiple />
																	</li>

																	<li>
																		<i className="fa fa-microphone" id="icon-record-audio" onClick={function () {
																			recordAudio()
																		}} style={{
																			cursor: "pointer"
																		}}></i>
																	</li>
																</ul>
															</div>
															
															<button className="msg_send_btn" name="submit" type="submit">
																<i className="fa fa-paper-plane-o" aria-hidden="true"></i>
															</button>
														</form>
			 
														<ul style={{
															listStyleType: "none"
														}}>
															<li>
																<div id="preview-attached-images" style={{
																	display: "flex"
																}}></div>
															</li>

															<li>
																<div id="preview-attached-videos" style={{
																	display: "flex"
																}}></div>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>

								    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}

export default Inbox