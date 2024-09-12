import { prismaClient } from "../src/application/database";

export const removeBookTest = async () => {
    await prismaClient.book.deleteMany({
        where: {
            code: "test-45"
        }
    });
};

export const createBookTest = async () => {
    await prismaClient.book.create({
        data: {
            code: 'test-45',
            title: 'test-title',
            author: 'test-author',
            stock: 1
        }
    });
};

export const getBookTest = async () => {
    return await prismaClient.book.findUnique({
        where: {
            code: "test-45"
        }
    });
};

