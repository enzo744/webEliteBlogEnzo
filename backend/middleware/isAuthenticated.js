import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false,
            })
        }
        const decode =  jwt.verify(token, process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false,
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log("Errore nel middleware isAuthenticated:", error);
        //Correzione: In caso di errore, restituisci una risposta 401 e ferma l'esecuzione.
        return res.status(401).json({
            message: "Invalid token or token expired",
            success: false,
        });
    }
};