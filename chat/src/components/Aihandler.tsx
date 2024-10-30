import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL || '';

export const fetchInterPretationWithReference = async (userFilledData : string, refPic64 : string[]) => {
    try {
        const response = await axios.post(`${apiUrl}/airoute/ref`, { userFilledData: userFilledData, refPic64: refPic64 }, {
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

export const fetchInterPretationWithSpaceImg = async (refPic64 : string[]) => {
  try {
      const response = await axios.post(`${apiUrl}/airoute/spaceimg`, { refPic64: refPic64 }, {
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

export const fetchInterPretationWithOnlyText = async (userFilledData : string) => {
  try {
      const response = await axios.post(`${apiUrl}/airoute/onlytext`, { userFilledData: userFilledData }, {
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

export const fetchInterPretationForWebSearch = async (refPic64 : string[], category: string) => {
  try {
      const response = await axios.post(`${apiUrl}/airoute/webSearch`, { refPic64: refPic64, category: category }, {
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