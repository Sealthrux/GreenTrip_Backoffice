import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const Vouchers = () => {
	const [vouchers, setVouchers] = useState([]);
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
					"http://localhost:8080/api/v1/rewards/",
					{
						headers: {
							Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
						},
					},
				);
				const { data } = response.data;
				setVouchers(data);
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
							<h4>ID</h4>
						</div>
						<div>
							<h4>Title</h4>
						</div>
						<div>
							<h4>Descreption</h4>
						</div>
						<div className="cost">
							<h4>Cost</h4>
						</div>
						<div>
							<h4>Expiry date</h4>
						</div>
						<div>
							<h4>Point of interest</h4>
						</div>
						<div className="qr">
							<img
								src="/imgs/qr.svg"
								alt="#"
							/>
						</div>
						<div>
							<StyledLink to={`/voucher/add`}>
								<button>Add</button>
							</StyledLink>
						</div>
					</User>
					{vouchers.map((voucher, index = 0) => (
						<User key={voucher._id}>
							<div>
								<h4>{++index}</h4>
							</div>
							<div>
								<p>{voucher.title}</p>
							</div>
							<div className="desc">
								<p>{voucher.description}</p>
							</div>
							<div className="cost">
								<p>{voucher.costPoints}</p>
							</div>
							<div>
								<p>
									{new Date(
										voucher.expireDate,
									).toLocaleDateString("en-US")}
								</p>
							</div>
							<div>
								<p>{voucher.pointOfInterest?.name || ""}</p>
							</div>
							<div className="qr">
								<img
									src={`${voucher.qrcode}`}
									alt="QR"
								/>
							</div>
							<div>
								<StyledLink to={`/voucher/edit/${voucher._id}`}>
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

export default Vouchers;

const Container = styled.div`
	width: 81%;
	height: 100vh;
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
		width: 15%;
		align-items: center;
		justify-content: center;
		text-align: center;

		p {
			font-weight: bold;
			font-size: 10px;
		}
	}

	.qr {
		background-color: #53924f;
		width: 12%;
		border-radius: 10px;

		img {
			width: 90%;
			height: 90%;
		}
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
