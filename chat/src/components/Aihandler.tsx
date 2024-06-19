import axios from "axios";

export const fetchInterPretationWithReference = async (refPic64 : string) => {
    try {
        const response = await axios.post('/airoute/ref', { refPic64: refPic64 }, {
          auth: {
              username: process.env.REACT_APP_HTTP_BASIC_AUTH_USERNAME!,
              password: process.env.REACT_APP_HTTP_BASIC_AUTH_PASSWORD!
          }
      });
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}