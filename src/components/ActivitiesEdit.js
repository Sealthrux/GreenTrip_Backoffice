import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ActivitiesEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [activity, setActivity] = useState({
		name: "",
		reservationLimit: "",
		startAt: "",
		description: "",
		pointOfInterest: "",
	});
	const [formattedDate, setFormattedDate] = useState("");
	const [points, setPoints] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		if (name === "startAt") {
			// Update the activity state with the formatted date
			const updatedActivity = {
				...activity,
				startAt: value,
			};
			setActivity(updatedActivity);
			setFormattedDate(value); // Also update the formattedDate state
		} else {
			// For other inputs, update the activity state normally
			setActivity((prevActivity) => ({
				...prevActivity,
				[name]: value,
			}));
		}
	};

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

	const formattedDateRef = useRef(formattedDate);
	formattedDateRef.current = formattedDate;

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/actvities/${id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setActivity(data.data);
				const date = new Date(data.data.startAt);
				const formatted = `${date.getFullYear()}-${String(
					date.getMonth() + 1,
				).padStart(2, "0")}-${String(date.getDate()).padStart(
					2,
					"0",
				)}T${String(date.getHours()).padStart(2, "0")}:${String(
					date.getMinutes(),
				).padStart(2, "0")}`;
				setFormattedDate(formatted);
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.get(`http://localhost:8080/api/v1/points/`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "multipart/form-data", // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setPoints(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleDelete = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.delete(
				`http://localhost:8080/api/v1/actvities/${id}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);
			if (response.status === 200) {
				toast.success("Data deleted");
				navigate("/activities");
			}
		} catch (error) {
			toast.error("Opps... there was a problem");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();

		try {
			const response = await axios.patch(
				`http://localhost:8080/api/v1/actvities/${id}`,
				activity,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);
			toast.success("Data updated successfully");
			// Optionally, you can redirect or show a success message here
		} catch (error) {
			toast.error("Error updating data");
			// Optionally, you can show an error message here
		}
	};

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<UserForm>
					<div>
						<InputLabel htmlFor="name">Name</InputLabel>
						<TextField
							id="name"
							required
							name="name"
							value={activity.name}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="reservationLimit">
							Reservation Limit
						</InputLabel>
						<TextField
							required
							name="reservationLimit"
							type="number"
							id="reservationLimit"
							value={activity.reservationLimit}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="startAt">Date & Time</InputLabel>
						<TextField
							required
							name="startAt"
							type="datetime-local"
							value={formattedDate}
							id="startAt"
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="description">
							Description
						</InputLabel>
						<TextField
							required
							name="description"
							type="text"
							id="description"
							value={activity.description}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="pointOfInterest">
							Points of Interest
						</InputLabel>
						<TextSelect
							required
							name="pointOfInterest"
							id="pointOfInterest"
							value={
								activity.pointOfInterest
									? activity.pointOfInterest.id
									: ""
							}
							onChange={handleInputChange}>
							<option
								key={""}
								value={""}></option>
							{points.map((point) => (
								<option
									key={point._id}
									value={point._id}>
									{point.name}
								</option>
							))}
						</TextSelect>
					</div>
					<Buttons>
						<Button
							type="submit"
							className="delete"
							onClick={handleDelete}>
							Delete
						</Button>
						<Button
							type="submit"
							onClick={handleSubmit}>
							Edit
						</Button>
					</Buttons>
				</UserForm>
			)}
		</Container>
	);
};

export default ActivitiesEdit;

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
	text-transform: capitalize;
`;

const TextSelect = styled.select`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	text-align: start;
	text-transform: capitalize;
`;

const InputLabel = styled.label`
	color: #53924f;
	font-weight: bold;
	letter-spacing: 2px;
	text-transform: uppercase;
	text-align: start;
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
