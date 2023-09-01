import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VoucherEdit = () => {
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

	const [modifiedUser, setModifiedUser] = useState([]);
	const [imagePreviewUrl, setImagePreviewUrl] = useState();
	const [points, setPoints] = useState([]);
	const expireDateRef = useRef("");
	const [expireDate, setExpireDate] = useState(expireDateRef.current);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`http://localhost:8080/api/v1/rewards/${id}`, {
				headers: {
					Authorization: `Bearer ${authToken}`, // Set the token in the Authorization header
				},
			})
			.then((response) => {
				const { data } = response.data;
				setModifiedUser(data.data);

				if (data.data.expireDate) {
					// Get the date portion from the timestamp
					const datePortion = data.data.expireDate.slice(0, 10);
					setExpireDate(datePortion);
				}

				if (data.data.qrcode) {
					setImagePreviewUrl(`${data.data.qrcode}`);
				}
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

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		if (name === "expireDate") {
			setExpireDate(value); // Update the expireDate state
		}
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
				qrcode: file, // Set the selected image file directly in the state
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

		formData.append("title", modifiedUser.title);
		formData.append("description", modifiedUser.description);
		formData.append("costPoints", modifiedUser.costPoints);
		formData.append("expireDate", modifiedUser.expireDate);

		if (Array.isArray(modifiedUser.pointOfInterest)) {
			formData.append("pointOfInterest", modifiedUser.pointOfInterest[0]);
		} else if (typeof modifiedUser.pointOfInterest === "object") {
			formData.append(
				"pointOfInterest",
				modifiedUser.pointOfInterest._id,
			);
		} else {
			formData.append("pointOfInterest", modifiedUser.pointOfInterest);
		}

		if (modifiedUser.qrcode) {
			formData.append("qrcode", modifiedUser.qrcode);
		}

		try {
			const response = await axios.patch(
				`http://localhost:8080/api/v1/rewards/${id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "multipart/form-data",
					},
				},
			);

			if (response.data.status === "success") {
				toast.success("Data updated successfully");
			}
			// Optionally, you can redirect or show a success message here
		} catch (error) {
			toast.error("Opps.. There is a problem");
			console.error("Error updating data:", error.response.data);
			// Optionally, you can show an error message here
		}
	};

	const handleDelete = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.delete(
				`http://localhost:8080/api/v1/rewards/${id}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);

			if (response.status === 200) {
				toast.success("Voucher Deleted");
				navigate("/vouchers");
			}
		} catch (error) {
			toast.error("Opps... there was a problem");
		}
	};

	return (
		<Container loading={loading}>
			{loading ? (
				"Loading..."
			) : (
				<UserForm>
					<div>
						<InputLabel htmlFor="title">Title</InputLabel>
						<TextField
							id="title"
							required
							name="title"
							value={modifiedUser.title || ""}
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
							value={modifiedUser.description || ""}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="cost">Cost</InputLabel>
						<TextField
							required
							name="costPoints"
							type="number"
							id="cost"
							value={modifiedUser.costPoints || ""}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="expireDate">
							Expiry Date
						</InputLabel>
						<TextField
							required
							name="expireDate"
							id="expireDate"
							type="date"
							value={expireDate || ""} // Use modifiedUser instead of user
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="pointOfInterest">
							Point Of Interest
						</InputLabel>
						<TextSelect
							required
							name="pointOfInterest"
							id="pointOfInterest"
							value={
								modifiedUser.pointOfInterest?._id ||
								modifiedUser.pointOfInterest ||
								""
							} // Use modifiedUser instead of user
							onChange={handleSelectChange}>
							<option
								key={""}
								value={""}>
								{""}
							</option>
							{points.map((point) => (
								<option
									key={point._id}
									value={point._id}>
									{point.name}
								</option>
							))}
						</TextSelect>
					</div>
					<InputLabel htmlFor="image-input">Image</InputLabel>
					<div
						className="image-file"
						id="image-file">
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

export default VoucherEdit;

const Container = styled.div`
	width: 81%;
	min-height: 100vh;
	margin-left: 19%;
	display: flex;
	flex-wrap: wrap;
	align-items: ${({ loading }) => (loading ? "center" : "flex-start")};
	justify-content: space-around;
	padding-top: 55px;
	text-transform: capitalize;

	@media only screen and (max-width: 750px) {
		padding-top: 80px;
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

	div {
		display: flex;
		flex-direction: column;
		width: 60%;

		@media only screen and (max-width: 750px) {
			width: 50%;
		}
	}

	#image-file {
		border-radius: 20px;
		width: 150px !important;
		height: 150px;
		background-color: #53924f;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 0;
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
	width: 100% !important;
	height: 100%;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
`;

const UploadButton = styled.label`
	position: absolute;
	bottom: -33px;
	right: -33px;
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
