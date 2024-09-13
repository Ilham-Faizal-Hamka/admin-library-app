import { prismaClient } from "../src/application/database";

export const removeBookTest = async () => {
    await prismaClient.book.deleteMany({
        where: {
            code: "test-45"
        }
    });
};

export const removeMemberTest = async () => {
    await prismaClient.member.deleteMany({
        where: {
            code: "test-45"
        }
    });
};

export const removeBorrowedBookTest = async () => {
    await prismaClient.borrowedBook.deleteMany({
        where: {
            memberCode: "test-45",
            bookCode: "test-45"
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

export const createMemberTest= async() => {
    await prismaClient.member.create({
        data: {
            code: 'test-45',
            name: 'test-name'
        }
    });
} 

export const getBookTest = async () => {
    return await prismaClient.book.findUnique({
        where: {
            code: "test-45"
        }
    });
};

export const getMemberTest = async() => {
    return await prismaClient.member.findUnique({
        where: {
            code: "test-45"
        }
    });
}
