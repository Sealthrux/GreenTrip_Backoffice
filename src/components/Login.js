import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userData, setUserData] = useState({});
	const [token, setToken] = useState("");
	const navigate = useNavigate();

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	useEffect(() => {
		// Add event listener for the popstate event
		window.addEventListener("popstate", props.checkLocation);
		props.checkLocation();

		return () => {
			window.removeEventListener("popstate", props.checkLocation);
		};
		// Initial check when the page loads
	}, []);

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

	useEffect(() => {
		// This effect will be triggered whenever userData changes

		if (userData.status === "success") {
			// Do something with the userData
			console.log("User data:", userData);
			// You can also check if token and role are valid here
			if (authToken && userData.data.user.role === "admin") {
				console.log("Navigating...");
				window.location.href = "/dashboard";
			} else {
				console.log("You are not authorized to access this");
			}
		}
	}, [navigate, authToken, userData]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:8080/api/v1/users/adminLogin",
				{
					email,
					password,
				},
			);

			const { status, token, data } = response.data;

			if (status === "success") {
				setCookie("authToken", token, 7);
				console.log(data.user._id);
				setCookie("userId", data.user._id, 7);
				setUserData(response.data);
				setToken(token);
			}

			if (authToken && data.user.role === "admin") {
				console.log("Navigating...");
				navigate("/dashboard");
			} else {
				console.log("You are not authorized to access this");
			}
		} catch (error) {
			// Handle error cases
			toast.error("Login failed. Please check your credentials.");
		}
	};

	const setCookie = (name, value, daysToExpire) => {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + daysToExpire);

		const cookieValue =
			encodeURIComponent(value) +
			(daysToExpire ? "; expires=" + expirationDate.toUTCString() : "");
		document.cookie = name + "=" + cookieValue + "; path=/";
	};

	return (
		<Container>
			<UpperContainer>
				<img
					src="/imgs/logo.svg"
					alt="logo"
				/>
			</UpperContainer>
			<BottomContainer>
				<LoginForm onSubmit={handleSubmit}>
					<div>
						<InputLabel htmlFor="email">Email</InputLabel>
						<TextField
							id="email"
							required
							name="email"
							value={email}
							onChange={handleEmailChange}
						/>
					</div>
					<div>
						<InputLabel htmlFor="password">Password</InputLabel>
						<TextField
							required
							name="password"
							type="password"
							id="password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</div>
					<Button type="submit">Login</Button>
				</LoginForm>
			</BottomContainer>
		</Container>
	);
};

export default Login;

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const UpperContainer = styled.section`
	width: 100%;
	height: 50vh;
	background-color: #53924f;
	display: flex;
	align-items: center;
	justify-content: center;
	text-transform: capitalize;

	img {
		width: 70%;
		height: 70%;
	}
`;

const BottomContainer = styled.section`
	width: 100%;
	height: 50%;
`;

const LoginForm = styled.form`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 25px;
	padding-top: 5%;

	div {
		display: flex;
		flex-direction: column;
		width: 25%;

		@media only screen and (max-width: 750px) {
			width: 50%;
		}
	}
`;

const TextField = styled.input`
	width: 100%;
	padding: 15px;
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
`;

const InputLabel = styled.label`
	color: #53924f;
	font-weight: bold;
	letter-spacing: 2px;
	text-transform: uppercase;
`;

const Button = styled.button`
	border-radius: 4px;
	border: 1px solid rgba(0, 0, 0, 0.3);
	background: #fff;
	padding: 15px 60px;
	color: #53924f;
	font-size: 16px;
	letter-spacing: 2px;
	font-weight: bold;
	text-transform: uppercase;
	cursor: pointer;
`;
