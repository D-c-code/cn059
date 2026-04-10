const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
const PORT = 5000;
const SECRET_KEY = "mysceret+key";
//dummy usser
const user ={
    id: 1,
    username: "admin",
    password: "1234"
};
//login route
app.post("/login", (req, res) =>{
    const { username, password } = req.body;
    if(username === user.username && password === user.password){
        const token = jwt.sign(
            {
                id:user.id,username : user.username},
                SECRET_KEY,
                {expiresIn : "1h"}
        );
        return res.json({ token});
    }
    res.status(401).json({ message: "Invalid crendentials" });
    });
    //Middleware to verify token
    function verifytoken(req, res, next){
        const authHeader = req.headers["authorization"];
        if(!authHeader){
            return res.status(401).json({ message: "Token missing" });
        }
        const token = authHeader . split(" ")[1]; //bearer token
        jwt.verify(token, SECRET_KEY, (err, decoded)=>{
            if(err){
                return res.status(403). json({ message: "Invalid token"});
            }
            req.user = decoded;
            next();
        });
    
    }
    // protected route
    app.get("/profile", verifytoken, (req, res) =>{
        res.json({
            message: "Welcome to profile",
            user: req.user
        });
    });
    app.listen(PORT, () => console.log('server running on ${PORT}'));

