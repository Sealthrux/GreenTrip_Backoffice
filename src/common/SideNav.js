import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SideNav = () => {
	return (
		<Container>
			<ContentContaner>
				<Content>
					<StyledNav to="/dashboard">Dashboard</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/users">User</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/points-of-interest">
						Points Of Interest
					</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/regions">Regions</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/activities">Activities</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/bookings">Bookings</StyledNav>
				</Content>
				<Content>
					<StyledNav to="/vouchers">Vouchers</StyledNav>
				</Content>
			</ContentContaner>
		</Container>
	);
};

export default SideNav;

const Container = styled.section`
	width: 17%;
	height: 100vh;
	max-height: 100vh;
	background: #53924f;
	position: fixed;
	padding-top: 90px;
`;

const ContentContaner = styled.div`
	width: 100%;
	display: flex;
	gap: 20px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 30px;
`;

const Content = styled.div`
	width: 80%;
	color: #fff;
	font-family: Montserrat;
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px; /* 66.667% */
	letter-spacing: 0.75px;
	text-transform: capitalize;
	border-bottom: 1px solid #fff;
	padding: 25px 0;
`;

const StyledNav = styled(Link)`
	color: #fff;
	text-decoration: none;

	&:hover {
		border-bottom: 1px solid #fff;
	}
`;
