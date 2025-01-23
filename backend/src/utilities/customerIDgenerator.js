import { v4 as uuidv4} from "uuid"


const generateCustomerId = () => {

    const generateUUID = uuidv4()

    const userFriendlyid =  `ORDER-${uuid.split('-')[0].toUpperCase()}`

    return userFriendlyid
}

export default generateCustomerId