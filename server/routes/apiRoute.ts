import express from 'express';
import { scrapeWebsite } from '../functions/webScraping';
import furnitureModel from '../dbModels/furnitureModel';
import counterModel from '../dbModels/counterModel';
import feedbackModel from '../dbModels/feedbackModel';
import { scrapeAndMakeAiData, scrapeAndMakeAiDataNew } from '../functions/scheduledFunctions';
import parameterLibrary from './../styleJson/parameterLibrary.json';

const apiRoute : express.Router = express.Router();

const counterModule = counterModel();
const feedbackModule = feedbackModel();

apiRoute.get("/", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/furnitureCategory", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let category : string = req.body.category;
        if(parameterLibrary.includes(category)){
            let data = await furnitureModel(category).fetchData();
            res.status(200).json(data);
        }
        else{
            res.status(404).json({ "error" : `invalid data` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/categoryWithQuantity", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let category : string = req.body.category;
        let quantity : number = req.body.quantity;
        if(parameterLibrary.includes(category) && typeof quantity === 'number'){
            let data = await furnitureModel(category).fetchDataWithQuantity(quantity);
            res.status(200).json(data);
        }
        else{
            res.status(404).json({ "error" : `invalid data` });
        }
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.get("/testScraping", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {

        // let automaticScraping = await scrapeAndMakeAiDataNew();
        
        res.status(200).json({ "message" : "apiroute initialized"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

apiRoute.post("/sendFeedback", async (req : express.Request, res : express.Response) : Promise<void> => { 
    try {
        let success: boolean = req.body.success;
        if(req.body.feedback){
            await feedbackModule.addData({ feedback: req.body.feedback });
        }
        await counterModule.updateFeedbackCounter(success);
        
        res.status(200).json({ "message" : "feedback updated"});
    } catch (e : any) {
        res.status(404).json({ "error" : `error fetching: ${e}` });
    }
});

export default apiRoute;