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

export const fetchFurnitureDataWithQuantity = async (category : string, quantity : number) => {
  try {
      const response = await axios.post('/apiroute/categoryWithQuantity', 
      { category: category, quantity: quantity }, //req.body
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