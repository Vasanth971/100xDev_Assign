const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const User = require("../db")
// User Routes
router.post('/signup',async (req, res) => {
    // Implement user signup logic
    // User.findOne({
    //     username: req.body.username,
    //     password: req.body.password
    // }).then((existing_User)=>{
    //     if (existing_User) {
    //         //if user exists, send the error response
    //         return res.status.json({
    //             msg: "User Already Exists",
    //         });
    //     } else {
    //         //If User doesnot exist, Create a new User
    //         const newUser = User.create({
    //             username: req.body.username,
    //             password: req.body.password
    //         })
    //         return res.status(200).json({
    //             msg: "user Created Succesfully!"
    //         })
    //     }
    // })

    try {
        const existingUser = User.findOne({
            username: req.body.username,
            password: req.body.password
        })
        if (existingUser){
            return res.status(400).json({
                msg: "User Already Exists!",
            });
        } else {
            const newUser = await User.create({
                username: req.body.username,
                password: req.body.password
            });
            return res.status(200).json({
                msg: "User Created Successfully!",
            })
        }
    } catch(error) {
        return res.status(500).json({
            msg: "Internal server Error",
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const course = await Course.findOne({});
    return res.status(200).json({
        msg: "Successfully retrieved all courses!",
        course: course
    })
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.UpdateOne({
        username: username,
    },{$push:{
        purchaseId: courseId
    }
    })
    return res.status(200).json({
        msg: "Course Purchased Succesfully!",
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username,
    })
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.status.json({
        courses: courses,
    })
});

module.exports = router