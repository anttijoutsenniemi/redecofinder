import axios from "axios";
import dedent from "dedent";
import furnitureStyles from '../styleJson/furnitureStyle.json';

export const fetchInterPretationWithReference = async (userFilledData : string, refPic64 : string) => {
    try {
      //this is for testing, comment this return statement to enable Ai
      // return dedent`{
      //   "nonValidImage": false,
      //   "explanation": "Test explanation",
      //   "colorThemes": {
      //       "dark": false,
      //       "light": true,
      //       "colorful": false,
      //       "earthy": false,
      //       "blackAndWhite": false,
      //   },
      //   "designStyles": {
      //       "industrial": false,
      //       "scandinavian": false,
      //       "minimalist": false,
      //       "modern": true,
      //       "farmhouse": false
      //   }
      // }`
      
      const apiKey = process.env.OPENAI_API_KEY;
      //const fillableJson = JSON.stringify(furnitureStyles);
      const fillableJson = JSON.stringify(furnitureStyles);
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          //model: "gpt-4-turbo",
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
              {
                  type: "text",
                  text: dedent`Im looking for furniture attributes that fit the following description: ${userFilledData}. You can also
                        take inspiration from the reference pictures provided by user. Your mission is to give each of the furniture attributes
                        in the given JSON a valuation between 0-100 on how well they would fit the given info. 
                        If the image is not valid please only fill nonValidImage key as true. Fill this JSON and return
                        it only: ${fillableJson}`
              },
              {
                  type: "image_url",
                  image_url: {
                    url: `${refPic64}`
                    //url: "https://images.tori.fi/api/v1/imagestori/images/100261082365.jpg?rule=medium_660",
                  },
              },
              ],
            },
          ],
          max_tokens: 1000,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )
      //console.log(result.data.choices[0].message.content);
      let answer = result.data.choices[0].message.content;
      return answer;
    } catch (error) {
      console.log("Error occured getting ai response: ", error);
      return false
    } 
  };