import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RegionAdd = () => {
	const [region, setRegions] = useState({
		name: "",
	});

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

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setRegions((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(
				`http://localhost:8080/api/v1/regions/`,
				region, // Send the updated region object
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "application/json", // Set the content type
					},
				},
			);
			toast.success("Region added Successfuly");
		} catch (error) {
			toast.error("There was a problem adding the region");
		}
	};

	return (
		<Container>
			<UserForm>
				<div>
					<InputLabel htmlFor="region">Name</InputLabel>
					<TextField
						required
						name="name"
						type="text"
						id="region"
						value={region.region}
						onChange={handleInputChange}
					/>
				</div>

				<Buttons>
					<Button
						type="submit"
						onClick={handleSubmit}>
						Add
					</Button>
				</Buttons>
			</UserForm>
		</Container>
	);
};

export default RegionAdd;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;

	justify-content: space-around;
	padding-top: 50px;
	text-transform: capitalize;

	@media only screen and (max-width: 750px) {
		height: 84vh;
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
	overflow: auto;

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
		gap: 8px;

		@media only screen and (max-width: 750px) {
			width: 50%;
		}
	}
`;

const TextField = styled.input`
	width: 100%;
	padding: 10px 10px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.3);
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
