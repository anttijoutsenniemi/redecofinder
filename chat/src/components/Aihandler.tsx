import axios from "axios";

export const fetchInterPretationWithReference = async (userFilledData : string, refPic64 : string[]) => {
    try {
        const response = await axios.post('/airoute/ref', { userFilledData: userFilledData, refPic64: refPic64 }, {
          auth: {
              username: process.env.REACT_APP_TESTER_USERNAME!,
              password: process.env.REACT_APP_TESTER_PASSWORD!
          }
      });
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}