import { prismaClient } from "../application/database";
import { validate } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import { registerBookValidation } from "../validations/book-validation";

const registerBook = async(request) => {
    const book = validate(registerBookValidation, request);

    const countBook = await prismaClient.book.count({
        where: {
            title: book.title,
            author: book.author
        }
    });

    if(countBook === 1){
        throw new ResponseError(400, "Book already exists");
    };

    return prismaClient.book.create({
        data: book,
        select: {
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });
} 



export default {
    registerBook
}