import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Dashboard = (props) => {
	useEffect(() => {
		// Add event listener for the popstate event
		window.addEventListener("popstate", props.checkLocation);

		// Initial check when the page loads
		props.checkLocation();
	}, []);

	const [dashboard, setDashboard] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/stats`, {
				headers: {
					Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setDashboard(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

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

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<>
					<div className="graph-container">
						<h1>Points of Interest</h1>
						<Graph>
							<h2>Points</h2>
							<h3>{dashboard.points}</h3>
						</Graph>
					</div>
					<div className="graph-container">
						<h1>Users</h1>
						<Graph>
							<h2>Users</h2>
							<h3>{dashboard.users}</h3>
						</Graph>
					</div>
					<div className="graph-container">
						<h1>Bookings</h1>
						<Graph>
							<h2>Bookings</h2>
							<h3>{dashboard.bookings}</h3>
						</Graph>
					</div>
					<div className="graph-container">
						<h1>Vouchers</h1>
						<Graph>
							<h2>Rewards</h2>
							<h3>{dashboard.rewards}</h3>
						</Graph>
					</div>
				</>
			)}
		</Container>
	);
};

export default Dashboard;

const Container = styled.div`
	width: 81%;
	height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-around;
	padding-top: 100px;
	text-transform: capitalize;

	.graph-container {
		width: 35%;
		height: 40%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-left: 13%;

		h1 {
			font-size: 25px;
			color: #53924f;
		}

		div {
			width: 90%;
			height: 100%;
		}
	}

	@media only screen and (max-width: 750px) {
		height: 84vh;
	}
`;

const Graph = styled.div`
	width: 100%;
	background: #d9d9d9;
	height: 100%;
	color: #53924f;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 20px;

	h2 {
		font-size: 40px;
		letter-spacing: 3px;
	}

	h3 {
		font-size: 25px;
	}
`;
