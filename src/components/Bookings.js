import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Bookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

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

	// Usage
	const authToken = getAuthToken();

	useEffect(() => {
		async function fetchBookings() {
			try {
				const response = await axios.get(
					"http://localhost:8080/api/v1/bookings/",
					{
						headers: {
							Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
						},
					},
				);
				const { data } = response.data;
				setBookings(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching bookings:", error);
			}
		}

		fetchBookings();
	}, []);

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<BookingsContainer>
					<BookingsHeader>
						<ul>
							<li>
								<h3>ID</h3>
							</li>
							<li>
								<h3>Activity</h3>
							</li>

							<li>
								<h3>User</h3>
							</li>
							<li>
								<h3>Status</h3>
							</li>
							<li>
								<Button> Add </Button>
							</li>
						</ul>
					</BookingsHeader>
					{bookings.map((booking, index = 0) => (
						<BookingsBody key={booking._id}>
							<ul>
								<li>
									<p>{++index}</p>
								</li>
								<li>
									<p>
										{booking.type === "point"
											? booking.point?.name
											: booking.activity?.name}
									</p>
								</li>

								<li>
									<p>{booking.user.name}</p>
								</li>
								<li>
									<p>{booking.status}</p>
								</li>
								<li>
									<StyledLink to={`/booking/${booking._id}`}>
										<Button> Manage </Button>
									</StyledLink>
								</li>
							</ul>
						</BookingsBody>
					))}
				</BookingsContainer>
			)}
		</Container>
	);
};

export default Bookings;

const Container = styled.div`
	width: 83%;
	min-height: 100vh;
	margin-left: 17%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: center;
	padding-top: 40px;
	text-transform: capitalize;
	@media only screen and (max-width: 750px) {
		height: 84vh;
	}
`;

const BookingsContainer = styled.div`
	margin-top: 5%;
	width: 95%;
	padding: 3% 4%;
	border-radius: 12px;
	background: #fff;
	height: 85%;
	box-shadow: 0px 4px 14px 2px rgba(0, 0, 0, 0.25);
	overflow: auto;
`;

const BookingsHeader = styled.div`
	display: flex;
	position: relative;
	padding-bottom: 30px;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	ul {
		width: 100%;
		display: flex;
		list-style: none;

		li {
			width: 20%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	h3 {
		text-align: left;
	}
`;

const BookingsBody = styled.div`
	display: flex;
	position: relative;
	padding: 25px 0;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	ul {
		width: 100%;
		display: flex;
		list-style: none;

		li {
			width: 20%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	p {
		font-size: 16px;
		text-align: center;
	}
`;

const Button = styled.button`
	position: absolute;
	display: flex;
	width: 89px;
	height: 36px;
	padding: 6px 6px 6px 8px;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	background: #53924f;
	right: 0;
	bottom: 18px;
	color: #fff;
	cursor: pointer;
`;

const StyledLink = styled(Link)`
	color: #fff;
	text-decoration: none;
	cursor: pointer;
`;
