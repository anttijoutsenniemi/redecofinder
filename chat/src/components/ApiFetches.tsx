import axios from "axios";

export const fetchFurnitureData = async (category : string) => {
    try {
        const response = await axios.post('/apiroute/furnitureCategory', 
        { category: category }, //req.body
        {
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