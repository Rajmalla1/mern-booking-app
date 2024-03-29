import express, {Request, Response} from "express";
import multer from 'multer';
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// we want to store any file or images that we get from the post request in memory 
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5MB in size
    }
})
//api/my-hotels
router.post(
    "/",
    verifyToken,
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("city").notEmpty().withMessage("City is required"),
      body("country").notEmpty().withMessage("Country is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("type").notEmpty().withMessage("Hotel type is required"),
      body("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("Price per night is required and must be a number"),
      body("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are required"),
    ],
upload.array("imageFiles", 6), async (req:Request, res: Response) => {
    try{
        // get the image files
        const imageFiles = req.files as Express.Multer.File[];
       //all the other properties that came alng with the form data in the post req and create a new hotel type from that data
        const newHotel: HotelType = req.body;
        

        //1. upload the images to cloudinary, we are uisng map to upload each individual image to cloudinary 
        const uploadPromises = imageFiles.map(async(image)=>{
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI="data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });
        
         //2. if the upload was successfull, add the URLS to the new hotels
        const imageUrls = await Promise.all(uploadPromises)
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

       
        //3. save the new hotels in our database
        const hotel = new Hotel(newHotel);
        await  hotel.save();

        //4. return a 201 status
        res.status(201).send(hotel);

    }
    catch(e) {
        console.log("Error creating Hotel: ",e);
        res.status(500).json({message:"Something went wrong" });
    }
});

export default router;