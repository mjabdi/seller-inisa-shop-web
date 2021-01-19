
import { convertToPersian } from "./persian-numbers"


export const formatPrice = (price) =>
{
    var number = parseInt(price)
    return `${number.toLocaleString('fa-IR')}`
}


