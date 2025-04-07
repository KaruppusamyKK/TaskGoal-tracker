// import axios from 'axios';

// const getAuthHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//   "Content-Type": "application/json",
// });

// const handleJwtExpiry = (error) => {
//   alert("/////////////")
//   if (error.response?.data?.message === "JWT token expired") {
//     localStorage.removeItem("jwtToken");
//     window.location.href = "/";
//   }
//   throw error.response?.data || "Something went wrong.";
// };

// /**
//  * Universal request function
//  * 
//  * @param {Object} options
//  * @param {'GET'|'POST'} options.method
//  * @param {string} options.url
//  * @param {Object} [options.body] - request body for POST
//  * @param {Object} [options.params] - query params for GET/POST
//  * 
//  */
// export const apiRequest = async ({ method, url, body = {}, params = {} }) => {
//   try {
//     const config = {
//       method,
//       url,
//       headers: getAuthHeaders(),
//       params,
//       data: body,
//     };

//     const response = await axios(config);
//     return response.data;
//   } catch (error) {
//     handleJwtExpiry(error);
//   }
// };
