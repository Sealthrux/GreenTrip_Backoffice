import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UserAdd = () => {
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");

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

	const [user, setUser] = useState({
		name: "",
		email: "",
		phone: "",
		points: "",
		role: "",
		password: "123456789",
		passwordConfirm: "123456789",
		region: "lisboa",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUser((prevUser) => ({
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
		}
	};

	const handleSubmit = () => {
		const formData = new FormData();

		// Append user data fields to the FormData
		formData.append("name", user.name);
		formData.append("email", user.email);
		formData.append("phone", user.phone);
		formData.append("password", "123456789");
		formData.append("passwordConfirm", "123456789");
		formData.append("points", user.points);
		formData.append("role", user.role);
		formData.append("region", "lisboa");

		// Append the image file to the FormData
		const imageFile = document.getElementById("image-input").files[0];
		if (imageFile) {
			formData.append("avatar", imageFile);
		}

		axios
			.post(`http://localhost:8080/api/v1/users/admin/add`, formData, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "multipart/form-data",
					// Set the content type to multipart/form-data
				},
			})
			.then((response) => {
				toast.success("User added Successfuly");
			})
			.catch((error) => {
				toast.error("There was a problem adding the user");
			});
	};

	return (
		<Container>
			<UserForm>
				<div className="image-file">
					<ImagePreview
						style={{ backgroundImage: `url(${imagePreviewUrl})` }}>
						<ImageInput
							type="file"
							id="image-input"
							accept="image/*"
							onChange={handleImageChange}
						/>
						<UploadButton htmlFor="image-input"></UploadButton>
					</ImagePreview>
				</div>
				<div>
					<InputLabel htmlFor="name">Name</InputLabel>
					<TextField
						id="name"
						required
						name="name"
						value={user.name}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<InputLabel htmlFor="email">Email</InputLabel>
					<TextField
						required
						name="email"
						type="text"
						id="email"
						value={user.email}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<InputLabel htmlFor="phone">Phone</InputLabel>
					<TextField
						required
						name="phone"
						type="text"
						id="phone"
						value={user.phone}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<InputLabel htmlFor="points">Points</InputLabel>
					<TextField
						required
						name="points"
						type="text"
						id="points"
						value={user.points}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<InputLabel htmlFor="user-type">User Type</InputLabel>
					<TextSelect
						required
						name="role"
						id="user-type"
						value={user.role}
						onChange={handleInputChange}>
						<option value=""></option>
						<option value="agent">Agent</option>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</TextSelect>
				</div>
				<Buttons>
					<Button
						type="submit"
						onClick={handleSubmit}>
						Save
					</Button>
				</Buttons>
			</UserForm>
		</Container>
	);
};

export default UserAdd;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
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
	gap: 25px;
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
`;

const TextSelect = styled.select`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	text-align: start;
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
