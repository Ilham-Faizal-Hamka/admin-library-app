import { prismaClient } from "../application/database";
import { validate } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import { updateBookValidation, registerBookValidation, getBookValidation } from "../validations/book-validation";


// resgister new book 
const register = async(request) => {
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
}; 

// get specific book
const get = async(request) => {
    const bookCode = validate(getBookValidation, request);

    const countBook = await prismaClient.book.count({
        where: {
            code: bookCode
        }
    });

    if(countBook !== 1){
        throw new ResponseError(404, "Book is not found");
    };

    return prismaClient.book.findUnique({
        where: {
            code: bookCode
        },
        select: {
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });
};

// get all available books 
const list = async() => {
    const countBook = await prismaClient.book.count();

    if(countBook === 0){
        throw new ResponseError(404, "Book is not found");
    };

    const totalAvailableBooks = await prismaClient.book.aggregate({
        _sum: {
            stock: true
        }
    });

    const availableBooks = await prismaClient.book.findMany({
        where: {
            stock: {
                gt: 0
            }
        },
        select: {
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });

    return {
        availableBooks,
        totalAvailableBooks: totalAvailableBooks._sum.stock
    };
};

// update book
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
};

export default {
    register,
    get,
    list,
    update
};