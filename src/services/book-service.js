import { prismaClient } from "../application/database";
import { validate } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import { updateBookValidation, registerBookValidation } from "../validations/book-validation";

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

const update = async(request) => {
    const book = validate(updateBookValidation, request);
    
    const countBook = await prismaClient.book.count({
        where: {
            code: book.code
        }
    });

    if(countBook !== 1){
        throw new ResponseError(404, "Book is not found");
    };


    return prismaClient.book.update({
        where : {
            code: book.code
        },
        data: {
            title: book.title,
            author: book.author,
            stock: book.stock
        },
        select: {
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });
}



export default {
    registerBook,
    update
}