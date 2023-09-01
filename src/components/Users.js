import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = () => {
	const [users, setUsersData] = useState([]);
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
					"http://localhost:8080/api/v1/users",
					{
						headers: {
							Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
						},
					},
				);
				const { data } = response.data;
				setUsersData(data);
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
					<UserHeader>
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
						<div className="email">
							<h4>Email</h4>
						</div>
						<div>
							<h4>Phone</h4>
						</div>
						<div>
							<h4>Points</h4>
						</div>
						<div>
							<h4>Type</h4>
						</div>
						<div>
							<StyledLink to={`/user/add`}>
								<button>Add</button>
							</StyledLink>
						</div>
					</UserHeader>
					{users.map((user, index = 0) => (
						<User
							$active={user.active.toString()}
							key={user.id}>
							<div>
								<div className="forImg">
									<img
										className="userImg"
										src={`${user.avatar}`}
										alt="user"
									/>
								</div>

								<h4>{++index}</h4>
							</div>
							<div>
								<h4>{user.name}</h4>
							</div>
							<div className="email">
								<h4>{user.email}</h4>
							</div>
							<div>
								<h4>{user.phone}</h4>
							</div>
							<div>
								<h4>{user.points}</h4>
							</div>
							<div>
								<h4>{user.role}</h4>
							</div>
							<div>
								<StyledLink to={`/user/edit/${user.id}`}>
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

export default Users;

const Container = styled.div`
	width: 81%;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: center;
	padding-top: 90px;
	text-transform: capitalize;
	min-height: 100vh;

	@media only screen and (max-width: 750px) {
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
	padding: 30px 10px;
`;

const User = styled.li`
	box-shadow: 0px 4px 14px 2px rgba(0, 0, 0, 0.25);
	width: 95%;
	padding: 15px 20px;
	background: #fff;
	border-radius: 12px;
	display: flex;
	gap: 5%;
	align-items: center;
	justify-content: center;

	div {
		display: flex;
		width: 10%;
		text-align: center;
		height: 100%;
		font-size: 14px;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}

	.forImg {
		width: 100%;
		height: 57px;
		.userImg {
			width: 70%;
			height: 85%;
			border-radius: 50%;
		}
	}

	.email {
		width: 15%;
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

	${({ $active }) =>
		$active === "false" && // Compare with 'false' as a string
		css`
			filter: grayscale(100%);
			background-color: #dcdcdc;
		`}
`;

const UserHeader = styled(User)`
	background-color: #fff;
	filter: none;
	color: #000;
`;

const StyledLink = styled(Link)`
	color: #fff;
	text-decoration: none;
	cursor: pointer;
`;
