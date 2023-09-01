import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Regions = () => {
	const [regions, setRegions] = useState([]);
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
		async function fetchRegions() {
			try {
				const response = await axios.get(
					"http://localhost:8080/api/v1/regions/",
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					},
				);
				const { data } = response.data;
				setRegions(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching regions:", error);
			}
		}

		fetchRegions();
	}, [authToken]);

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<RegionsContainer>
					<RegionsHeader>
						<h3>ID</h3>
						<h3>Name</h3>
						<StyledLink to={"/region/add"}>
							<Button> Add </Button>
						</StyledLink>
					</RegionsHeader>
					{regions.map((region, index = 0) => (
						<RegionsBody key={region._id}>
							<p>{++index}</p>
							<p>{region.name}</p>
							<StyledLink to={`/region/edit/${region._id}`}>
								<Button>Edit</Button>
							</StyledLink>
						</RegionsBody>
					))}
				</RegionsContainer>
			)}
		</Container>
	);
};

export default Regions;

const Container = styled.div`
	width: 83%;
	height: 100vh;
	margin-left: 17%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: center;
	padding-top: 40px;
	@media only screen and (max-width: 750px) {
		height: 84vh;
	}
	text-transform: capitalize;
`;

const RegionsContainer = styled.div`
	margin-top: 5%;
	width: 95%;
	padding: 3% 4%;
	border-radius: 12px;
	background: #fff;
	height: 85%;
	box-shadow: 0px 4px 14px 2px rgba(0, 0, 0, 0.25);
	overflow: auto;
`;

const RegionsHeader = styled.div`
	display: flex;
	gap: 2%;
	position: relative;
	padding-bottom: 30px;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	h3 {
		width: 10%;
	}
`;

const RegionsBody = styled.div`
	display: flex;
	gap: 2.5%;
	position: relative;
	padding: 25px 0;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	p {
		width: 10%;
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
	cursor: pointer;
	color: #fff;
`;

const StyledLink = styled(Link)`
	color: #fff;
	text-decoration: none;
	cursor: pointer;
`;
