import jwt from "jsonwebtoken"

const accessToken = ({id, name, email, avatar} : {id : string, name : string, email : string, avatar : {public_id : string, secure_url : string}}) => {
    const token = jwt.sign({id, name, email, avatar},  process.env.JWT_SECRET!, {expiresIn: "7d"});
    return token;
}

export default accessToken