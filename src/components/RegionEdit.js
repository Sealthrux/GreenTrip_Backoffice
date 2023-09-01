import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RegionEdit = () => {
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

	const [region, setRegions] = useState({
		name: "", // Initialize with an empty string or an appropriate default value
	});
	const [loading, setLoading] = useState(true);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setRegions((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/regions/${id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setRegions(data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.patch(
				`http://localhost:8080/api/v1/regions/${id}`,
				region, // Send the updated region object
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "application/json", // Set the content type
					},
				},
			);
			toast.success("Region updated successfully");
			// Optionally, you can redirect or show a success message here
		} catch (error) {
			toast.error("Error updating region");
			// Optionally, you can show an error message here
		}
	};

	const handleDelete = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.delete(
				`http://localhost:8080/api/v1/regions/${id}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);
			if (response.status === 200) {
				toast.success("Region Deleted");

				navigate("/regions");
			}
		} catch (error) {
			toast.error("Opps.. There was a problem");
		}
	};

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<UserForm>
					<h2>Add Region</h2>
					<div>
						<InputLabel htmlFor="region">Name</InputLabel>
						<TextField
							required
							name="name"
							type="text"
							id="region"
							value={region.name}
							onChange={handleInputChange}
						/>
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

export default RegionEdit;

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

	h2 {
		color: #53924f;
		text-align: center;
		font-family: Montserrat;
		font-size: 30px;
		font-style: normal;
		font-weight: 700;
		line-height: 16px; /* 44.444% */
		letter-spacing: 0.75px;
		text-transform: capitalize;
		padding-bottom: 20px;
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

	@media only screen and (max-width: 750px) {
		margin-top: 15%;
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
