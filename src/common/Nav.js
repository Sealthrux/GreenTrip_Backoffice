import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

const Nav = () => {
	const [profile, setProfile] = useState(false);
	const navigate = useNavigate();

	const handleProfile = () => {
		setProfile(!profile);
	};

	const handleLogout = () => {
		// Clear cookies or perform other logout-related actions
		document.cookie =
			"authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

		// Navigate to the login page
		navigate("/");
	};

	let styledProfile = {};

	profile
		? (styledProfile = {
				visibility: "visible",
		  })
		: (styledProfile = { visibility: "hidden" });

	return (
		<>
			<Container>
				<img
					src="/imgs/profile.svg"
					onClick={handleProfile}
					alt="profile"
				/>
			</Container>

			<ProfileContent style={styledProfile}>
				<StyledLink to={"/user"}>
					<ProfileButton>Account</ProfileButton>
				</StyledLink>

				<Button onClick={handleLogout}>Logout</Button>
			</ProfileContent>
		</>
	);
};

export default Nav;

const Container = styled.section`
	width: 100%;
	background-image: url("/imgs/navBG.png");
	position: fixed;
	top: 0;
	z-index: 999;
	height: 90px;
	background-repeat: no-repeat;
	background-size: cover;
	background-position-y: center;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		position: absolute;
		right: 50px;
	}
`;

const ProfileContent = styled.div`
	position: absolute;
	right: 0;
	top: 90px;
	width: 300px;
	height: 180px;
	background-color: #fff;
	box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20px;
	flex-direction: column;
	z-index: 100000;
`;

const Button = styled.div`
	width: 70%;
	text-align: center;
	color: #fff;
	padding: 15px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	background: #53924f;
	font-family: Montserrat;
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px; /* 100% */
	letter-spacing: 1.25px;
	text-transform: uppercase;
`;

const ProfileButton = styled(Button)`
	width: 100%;
`;

const StyledLink = styled(Link)`
	cursor: pointer;
	text-decoration: none;
	width: 70%;
`;
