import React, { useState, useEffect } from "react";
import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useNavigate,
} from "react-router-dom";
import Nav from "./common/Nav";
import SideNav from "./common/SideNav";
import BookingManage from "./components/BookingManage";
import Login from "./components/Login";
import Activities from "./components/Activities";
import ActivitiesAdd from "./components/ActivitiesAdd";
import ActivitiesEdit from "./components/ActivitiesEdit";
import Bookings from "./components/Bookings";
import Dashboard from "./components/Dashboard";
import PointsOfInterest from "./components/PointsOfInterest";
import PointsOfInterestEdit from "./components/PointsOfInterestEdit";
import PointsOfInterestNew from "./components/PointsOfInterestNew";
import RegionAdd from "./components/RegionAdd";
import RegionEdit from "./components/RegionEdit";
import Regions from "./components/Regions";
import User from "./components/User";
import UserAdd from "./components/UserAdd";
import UserEdit from "./components/UserEdit";
import Users from "./components/Users";
import Vouchers from "./components/Vouchers";
import VoucherEdit from "./components/VoucherEdit";
import VoucherAdd from "./components/VoucherAdd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyles from "./global-styles";
// Import other components...

function App() {
	const [currentPath, setCurrentPath] = useState(
		window.location.pathname.split("/"),
	);

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
	const [redirected, setRedirected] = useState(false);

	const checkLocation = () => {
		setCurrentPath(window.location.pathname.split("/"));
		// Check the current URL path and perform actions based on it

		// Additional logic goes here
	};

	useEffect(() => {
		// Add event listener for the popstate event
		window.addEventListener("popstate", checkLocation);

		// Initial check when the page loads
		checkLocation();
	}, []);

	return (
		<Router>
			<GlobalStyles />
			<div className="App">
				{currentPath[1] === "" ? "" : <Nav key={currentPath} />}
				{currentPath[1] === "" ? "" : <SideNav />}
				<Routes>
					<Route
						path="/"
						element={<Login checkLocation={checkLocation} />}
					/>

					<Route
						path="/booking/:id"
						element={
							authToken ? <BookingManage /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/activities"
						element={
							authToken ? <Activities /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/activities/add"
						element={
							authToken ? <ActivitiesAdd /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/activities/edit/:id"
						element={
							authToken ? <ActivitiesEdit /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/bookings"
						element={authToken ? <Bookings /> : <Navigate to="/" />}
					/>
					<Route
						path="/dashboard"
						element={
							authToken ? (
								<Dashboard checkLocation={checkLocation} />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/points-of-interest"
						element={
							authToken ? (
								<PointsOfInterest />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/points-of-interest/edit/:id"
						element={
							authToken ? (
								<PointsOfInterestEdit />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/points-of-interest/new"
						element={
							authToken ? (
								<PointsOfInterestNew />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/regions"
						element={authToken ? <Regions /> : <Navigate to="/" />}
					/>
					<Route
						path="/region/add"
						element={
							authToken ? <RegionAdd /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/region/edit/:id"
						element={
							authToken ? <RegionEdit /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/users"
						element={authToken ? <Users /> : <Navigate to="/" />}
					/>
					<Route
						path="/user/add"
						element={authToken ? <UserAdd /> : <Navigate to="/" />}
					/>
					<Route
						path="/user/edit/:id"
						element={authToken ? <UserEdit /> : <Navigate to="/" />}
					/>
					<Route
						path="/user"
						element={authToken ? <User /> : <Navigate to="/" />}
					/>
					<Route
						path="/vouchers"
						element={authToken ? <Vouchers /> : <Navigate to="/" />}
					/>
					<Route
						path="/voucher/edit/:id"
						element={
							authToken ? <VoucherEdit /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/voucher/add"
						element={
							authToken ? <VoucherAdd /> : <Navigate to="/" />
						}
					/>
				</Routes>
				<ToastContainer />
			</div>
		</Router>
	);
}

export default App;
