import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Activities = () => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchActivities() {
			try {
				const response = await axios.get(
					"http://localhost:8080/api/v1/actvities/",
				);
				const { data } = response.data;
				setActivities(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		}

		fetchActivities();
	}, []);

	// Function to format the date and time
	const formatDateAndTime = (dateTime) => {
		const dateObj = new Date(dateTime);
		const formattedDate = dateObj.toISOString().slice(0, 10);
		const formattedTime = dateObj.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		return `${formattedDate} ${formattedTime}`;
	};
	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<ActivitiesContainer>
					<ActivitiesHeader>
						<ul>
							<li>
								<h3>ID</h3>
							</li>
							<li>
								<h3>Name</h3>
							</li>
							<li>
								<h3>Reservation Limit</h3>
							</li>
							<li>
								<h3>Date & Time</h3>
							</li>
							<li>
								<h3>Description</h3>
							</li>
							<li>
								<h3>Points of Interest</h3>
							</li>
							<li>
								<StyledLink to={"/activities/add"}>
									<Button> Add </Button>
								</StyledLink>
							</li>
						</ul>
					</ActivitiesHeader>
					{activities.map((activity, index = 0) => (
						<ActivitiesBody key={activity._id}>
							<ul>
								<li>
									<p>{++index}</p>
								</li>
								<li>
									<p>{activity.name}</p>
								</li>
								<li>
									<p>{activity.reservationLimit}</p>
								</li>
								<li>
									<p>{formatDateAndTime(activity.startAt)}</p>
								</li>
								<li className="desc">
									<p>{`${
										activity.description.split(" ")[0]
									}...`}</p>
								</li>
								<li>
									<p>{activity.pointOfInterest?.name}</p>
								</li>
								<li>
									<StyledLink
										to={`/activities/edit/${activity._id}`}>
										<Button> Edit </Button>
									</StyledLink>
								</li>
							</ul>
						</ActivitiesBody>
					))}
				</ActivitiesContainer>
			)}
		</Container>
	);
};

export default Activities;

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

const ActivitiesContainer = styled.div`
	margin-top: 5%;
	width: 95%;
	padding: 3% 4%;
	border-radius: 12px;
	background: #fff;
	height: 85%;
	box-shadow: 0px 4px 14px 2px rgba(0, 0, 0, 0.25);
	overflow: auto;
`;

const ActivitiesHeader = styled.div`
	display: flex;
	position: relative;
	padding-bottom: 30px;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	ul {
		width: 100%;
		display: flex;
		list-style: none;
		gap: 1%;

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

const ActivitiesBody = styled.div`
	display: flex;
	position: relative;
	padding: 25px 0;
	border-bottom: 1px solid #c8c8c8;
	font-size: 15px;

	ul {
		width: 100%;
		display: flex;
		list-style: none;
		gap: 20px;

		li {
			width: 15%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.desc {
			overflow: auto;
			display: flex;
			align-items: start;
			height: 50px;
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
