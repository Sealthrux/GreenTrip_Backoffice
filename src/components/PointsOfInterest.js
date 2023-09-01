import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const PointsOfInterest = () => {
	const [points, setPoints] = useState([]);
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
		async function fetchUserData() {
			try {
				const response = await axios.get(
					"http://localhost:8080/api/v1/points/",
					{
						headers: {
							Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
						},
					},
				);
				const { data } = response.data;
				setPoints(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}

		fetchUserData();
	}, []);

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<Userss>
					<User>
						<div>
							<img
								src="/imgs/user.svg"
								alt="user"
							/>

							<h4>ID</h4>
						</div>
						<div>
							<h4>Name</h4>
						</div>
						<div>
							<h4>Descreption</h4>
						</div>
						<div className="email">
							<h4>Address</h4>
						</div>
						<div>
							<h4>Category</h4>
						</div>
						<div>
							<h4>Region</h4>
						</div>
						<div>
							<h4>Agent</h4>
						</div>
						<div>
							<StyledLink to={`/points-of-interest/new`}>
								<button>Add</button>
							</StyledLink>
						</div>
					</User>
					{points.map((user, index = 0) => (
						<User key={user._id}>
							<div>
								<div className="forImg">
									<img
										src={`${user.photo}`}
										alt="user"
									/>
								</div>

								<h4>{++index}</h4>
							</div>
							<div>
								<p>{user.name}</p>
							</div>
							<div className="desc">
								<p>{user.description}</p>
							</div>
							<div className="email">
								<p>{user.address}</p>
							</div>
							<div>
								<p>{user.category}</p>
							</div>
							<div>
								<p>{user.region}</p>
							</div>
							<div>
								<p>{user.agent.name}</p>
							</div>
							<div>
								<StyledLink
									to={`/points-of-interest/edit/${user.id}`}>
									<button>Edit</button>
								</StyledLink>
							</div>
						</User>
					))}
				</Userss>
			)}
		</Container>
	);
};

export default PointsOfInterest;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: space-around;
	padding-top: 90px;
	text-transform: capitalize;

	@media only screen and (max-width: 750px) {
		height: 84vh;
	}
`;

const Userss = styled.ul`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	list-style: none;
	gap: 20px;
	padding-top: 20px;
`;

const User = styled.li`
	box-shadow: 0px 4px 14px 2px rgba(0, 0, 0, 0.25);
	width: 98%;
	padding: 10px 20px;
	background: #fff;
	border-radius: 12px;
	display: flex;
	gap: 3%;
	justify-content: center;

	div {
		display: flex;
		width: 10%;
		align-items: center;
		gap: 15px;
		justify-content: center;

		img {
			width: 85%;
			height: 85%;
			border-radius: 50%;
		}

		.forImg {
			width: 60px;
			height: 60px;
			img {
				width: 85%;
				height: 85%;
				border-radius: 50%;
			}
		}

		p {
			font-weight: bold;
			font-size: 10px;
		}
	}

	.desc {
		width: 12%;
		overflow: auto;
		text-overflow: clip;
		align-items: start;
		height: 70px;
	}

	.email {
		width: 10%;
		justify-content: center;
	}

	button {
		display: flex;
		width: 69px;
		height: 34px;
		padding: 6px 6px 6px 8px;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		background: #53924f;
		cursor: pointer;
	}
`;

const StyledLink = styled(Link)`
	color: #fff;
	text-decoration: none;
	cursor: pointer;
`;
