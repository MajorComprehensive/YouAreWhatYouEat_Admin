import { EmployeeUpload } from '@/models/employee';

import axios from 'axios';

import GlobalConfig from '@/utils/config';

export default async function handler(req, res) {
	if (req.method === 'POST') {
	  // Process a POST request

		const employee:EmployeeUpload = req.body;

		const data = (
			await axios.post(GlobalConfig.getAuthorizationURL() + '/api/signup', {
			"application": "application_dbks",
			"organization": "organization_dbks",
			"username": "E"+employee.id.toString(),
			"name": employee.name,
			"password": employee.password,
			"confirm": employee.password,
			"email": employee.email
		})
		).data;

		res.status(200).json(data);
	}
}