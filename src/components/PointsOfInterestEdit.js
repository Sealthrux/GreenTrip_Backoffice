import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PointsOfInterestEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams();
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

	const [agentUserData, setAgentUsersData] = useState([]);
	const [regions, setRegions] = useState([]);
	const [modifiedUser, setModifiedUser] = useState([]);
	const [imagePreviewUrl, setImagePreviewUrl] = useState();
	const [loading, setLoading] = useState(true); // Add loading state
	// ... rest of your code ...

	useEffect(() => {
		const fetchData = async () => {
			try {
				const responsePoints = axios.get(
					`http://localhost:8080/api/v1/points/${id}`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					},
				);

				const responseRegions = axios.get(
					`http://localhost:8080/api/v1/regions/`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					},
				);

				const responseAgentUsers = axios.get(
					`http://localhost:8080/api/v1/users`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					},
				);

				const [pointsResponse, regionsResponse, agentUsersResponse] =
					await Promise.all([
						responsePoints,
						responseRegions,
						responseAgentUsers,
					]);

				const { data: pointsData } = pointsResponse.data;
				const { data: regionsData } = regionsResponse.data;
				const { data: agentUsersData } = agentUsersResponse.data;

				setModifiedUser(pointsData.data);

				if (pointsData.data.photo) {
					setImagePreviewUrl(`${pointsData.data.photo}`);
				}

				setRegions(regionsData);
				setAgentUsersData(agentUsersData);
				setLoading(false); // Set loading to false when data is fetched
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setModifiedUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreviewUrl(reader.result);
			};
			reader.readAsDataURL(file);

			setModifiedUser((prevUser) => ({
				...prevUser,
				photo: file, // Set the selected image file directly in the state
			}));
		}
	};

	const handleSelectChange = (event) => {
		const { name, options } = event.target;
		const selectedOptions = Array.from(options)
			.filter((option) => option.selected)
			.map((option) => option.value);

		// Check if it's the "region" field
		if (name === "region") {
			// If there's only one selected option, set it as a string
			if (selectedOptions.length === 1) {
				setModifiedUser((prevUser) => ({
					...prevUser,
					[name]: selectedOptions[0],
				}));
			} else {
				setModifiedUser((prevUser) => ({
					...prevUser,
					[name]: selectedOptions,
				}));
			}
		} else {
			setModifiedUser((prevUser) => ({
				...prevUser,
				[name]: selectedOptions,
			}));
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();

		formData.append("name", modifiedUser.name);
		formData.append("description", modifiedUser.description);
		formData.append("address", modifiedUser.address);
		formData.append("region", modifiedUser.region);
		formData.append("agent", modifiedUser.agent._id);

		if (modifiedUser.photo) {
			formData.append("photo", modifiedUser.photo);
		}

		axios
			.patch(`http://localhost:8080/api/v1/points/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "multipart/form-data",
					// Set the content type to multipart/form-data
				},
			})
			.then((response) => {
				toast.success("Point Edited");
			})
			.catch((error) => {
				toast.error("Opps.. There was a problem");
			});
	};

	const handleDelete = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.delete(
				`http://localhost:8080/api/v1/points/${id}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);

			if (response.status === 200) {
				toast.success("Point deleted");
				navigate("/points-of-interest");
			}
		} catch (error) {
			toast.error("Opps.. There was a problem");
		}
	};

	return (
		<Container loading={loading}>
			{loading ? (
				<p>Loading...</p>
			) : (
				<UserForm>
					<div>
						<InputLabel htmlFor="name">Name</InputLabel>
						<TextField
							id="name"
							required
							name="name"
							value={modifiedUser.name}
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
							value={modifiedUser.description}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="address">address</InputLabel>
						<TextField
							required
							name="address"
							type="text"
							id="address"
							value={modifiedUser.address}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="region">Region</InputLabel>
						<TextSelect
							required
							name="region"
							id="region"
							value={
								modifiedUser.region ? modifiedUser.region : ""
							} // Use modifiedUser instead of user
							onChange={handleSelectChange}>
							<option
								key={""}
								value={""}>
								{""}
							</option>
							{regions.map((region) => (
								<option
									key={region._id}
									value={region.name}>
									{region.name}
								</option>
							))}
						</TextSelect>
					</div>
					<div>
						<InputLabel htmlFor="agent">Agent</InputLabel>
						<TextSelect
							required
							name="agent"
							id="agent"
							value={
								modifiedUser.agent ? modifiedUser.agent._id : ""
							} // Use modifiedUser instead of user
							onChange={handleSelectChange}>
							{regions &&
								agentUserData.map((usr) =>
									usr.role === "agent" ? (
										<option
											key={usr._id}
											value={usr.name}>
											{usr.name}
										</option>
									) : (
										""
									),
								)}
						</TextSelect>
					</div>
					<InputLabel htmlFor="image-input">Image</InputLabel>
					<div className="image-file">
						<ImagePreview
							style={{
								backgroundImage: `url(${imagePreviewUrl})`,
							}}>
							<ImageInput
								type="file"
								id="image-input"
								accept="image/*"
								onChange={handleImageChange}
							/>
							<UploadButton htmlFor="image-input"></UploadButton>
						</ImagePreview>
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

export default PointsOfInterestEdit;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: space-around;
	padding-top: 60px;
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
	gap: 18px;
	padding-top: 5%;

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
	font-weight: bold;
	font-size: 12px;
	text-transform: capitalize;
`;

const TextSelect = styled.select`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	text-align: start;
	font-weight: bold;
	font-size: 12px;
	text-transform: capitalize;
`;

const InputLabel = styled.label`
	color: #53924f;
	font-weight: bold;
	letter-spacing: 2px;
	text-transform: uppercase;
	text-align: start;
`;

const ImageInput = styled.input`
	display: none;
`;

const ImagePreview = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	overflow: hidden;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
`;

const UploadButton = styled.label`
	position: absolute;
	bottom: 0px;
	right: 0px;
	background-color: #007bff;
	color: white;
	padding: 30px;
	border-radius: 50%;
	cursor: pointer;
	background-image: url("/imgs/save.svg");
	background-position: center;
	background-size: cover;
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
