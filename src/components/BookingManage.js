import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const BookingManage = () => {
	const { id } = useParams();
	const getCookie = (name) => {
		const cookies = document.cookie.split("; ");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].split("=");
			if (cookie[0] === name) {
				return decodeURIComponent(cookie[1]);
			}
		}
		return null; // Cookie not found
	};

	const getAuthToken = () => {
		const authToken = getCookie("authToken");
		return authToken;
	};

	const authToken = getAuthToken();

	const [booking, setBooking] = useState([]);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Make the API request to get the token
		axios
			.get(`http://localhost:8080/api/v1/bookings/${id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setBooking(data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleAccept = () => {
		// Make the API request to update the booking status to "active"
		axios
			.patch(
				`http://localhost:8080/api/v1/bookings/${id}`,
				{ status: "active" }, // Update the status as needed
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			)
			.then((response) => {
				toast.success("Book Accepted");
			})
			.catch((err) => {
				// Handle errors
				toast.error("There was a problem");
			});
	};

	const handleDeny = () => {
		// Make the API request to update the booking status to "canceled"
		axios
			.patch(
				`http://localhost:8080/api/v1/bookings/${id}`,
				{ status: "canceled" }, // Update the status as needed
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			)
			.then((response) => {
				toast.warn("Book denied");
			})
			.catch((err) => {
				// Handle errors
				toast.error("There was an error");
			});
	};

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<UserForm>
					<h2>User</h2>
					<div>
						<InputLabel htmlFor="name">Name</InputLabel>
						<TextField
							id="name"
							required
							name="name"
							defaultValue={booking.user?.name || ""}
							readOnly
						/>
					</div>
					<div>
						<InputLabel htmlFor="Phone">Phone</InputLabel>
						<TextField
							required
							name="Phone"
							type="text"
							id="Phone"
							defaultValue={
								booking.user ? booking.user.phone : ""
							}
							readOnly
						/>
					</div>
					<h2 className="activity">Activities</h2>
					<div>
						<InputLabel htmlFor="pt">Points of Interest</InputLabel>
						<TextField
							required
							name="pt"
							type="text"
							defaultValue={
								booking.type === "point"
									? booking.point?.name || ""
									: booking.activity?.name || ""
							}
							id="pt"
							readOnly
						/>
					</div>
					<div>
						<InputLabel htmlFor="rs">Reservations</InputLabel>
						<TextField
							required
							name="rs"
							type="text"
							id="rs"
							defaultValue={
								booking.type === "point"
									? booking.point?.availableTickets || ""
									: booking.activity?.availableTickets || ""
							}
							readOnly
						/>
					</div>

					<Buttons>
						<Button
							type="submit"
							className="delete"
							onClick={handleDeny}>
							Deny
						</Button>
						<Button
							type="submit"
							onClick={handleAccept}>
							Accept
						</Button>
					</Buttons>
				</UserForm>
			)}
		</Container>
	);
};

export default BookingManage;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: space-around;
	padding-top: 50px;
	text-transform: capitalize;

	@media only screen and (max-width: 750px) {
		height: 84vh;
	}
`;

const UserForm = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 25px;
	padding-top: 6%;

	h2 {
		color: #53924f;
		text-align: center;
		font-family: Montserrat;
		font-size: 30px;
		font-style: normal;
		padding-top: 10px;
		font-weight: 700;
		line-height: 16px; /* 44.444% */
		letter-spacing: 0.75px;
		text-transform: capitalize;
	}

	.activity {
		padding-top: 35px;
	}

	.image-file {
		border-radius: 50%;
		width: 150px;
		height: 150px;
		background-color: #53924f;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30px 0;
	}

	div {
		display: flex;
		flex-direction: column;
		width: 60%;

		@media only screen and (max-width: 750px) {
			width: 50%;
		}
	}
`;

const TextField = styled.input`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	text-align: start;
`;

const TextSelect = styled.select`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	text-align: start;
`;

const InputLabel = styled.label`
	color: #53924f;
	font-weight: bold;
	letter-spacing: 2px;
	text-transform: uppercase;
	text-align: start;
`;

const ImageInput = styled.input`
	display: none;
`;

const ImagePreview = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	overflow: hidden;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
`;

const UploadButton = styled.label`
	position: absolute;
	bottom: 0px;
	right: 0px;
	background-color: #007bff;
	color: white;
	padding: 30px;
	border-radius: 50%;
	cursor: pointer;
	background-image: url("/imgs/save.svg");
	background-position: center;
	background-size: cover;
`;

const Buttons = styled.section`
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 40px;
	right: 30px;
	flex-direction: row;
	gap: 5px;

	.delete {
		background: #929ba8;
	}
`;

const Button = styled.button`
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #53924f;
	padding: 10px 30px;
	color: #fff;
	font-size: 12px;
	letter-spacing: 2px;
	font-weight: bold;
	text-transform: uppercase;
	cursor: pointer;
`;
