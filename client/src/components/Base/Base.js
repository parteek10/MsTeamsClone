import axios from 'axios';
import React, { useEffect } from 'react';
import { isAuthenticated } from '../Authentication/auth';
import Navbar from '../Navbar/Navbar'

const Base = ({
	title = "title",
	description = "my description",
	className = "",
	children }) => {

	const validateUser = async () => {
		const { token } = isAuthenticated();

		if (!token)
			return;
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};

		try {
			const res = await axios.get(`/user/verify`, config);
			// if (res)
			// 	console.log(res);
		} catch (error) {
			console.log(error);
			window.alert("Session expired SignIn again");
			localStorage.removeItem("jwt");
			window.location.reload();
			return;
		}
	}

	useEffect(() => {
		validateUser();
	}, []);

	return (
		<>
			<Navbar />
			<div className="children" style={{ marginTop: '100px' }} >
				{children}
			</div>
		</>
	);
}

export default Base;
