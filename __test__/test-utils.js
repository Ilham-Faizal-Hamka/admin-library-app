import { prismaClient } from "../src/application/database";

export const removeBookTest = async () => {
    await prismaClient.book.deleteMany({
        where: {
            code: {
                contains: "test"
            }
        }
    });
};

export const removeMemberTest = async () => {
    await prismaClient.member.deleteMany({
        where: {
            code: {
                contains: "test"
            }
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

    await prismaClient.book.update({
        where: {
            code: "test-45"
        },
        data: {
            stock: {
                increment: 1
            }
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

export const createNewBookTest = async () => {
    await prismaClient.book.create({
        data: {
            code: 'test-46',
            title: 'test-title 2',
            author: 'test-author 2',
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

export const createNewMemberTest= async() => {
    await prismaClient.member.create({
        data: {
            code: 'test-46',
            name: 'test-name 2'
        }
    });
} 

export const createBorrowedBookTest = async() => {
    await prismaClient.borrowedBook.create({
        data: {
            memberCode: 'test-45',
            bookCode: 'test-45',
            borrowedAt: new Date()
        }
    });

    await prismaClient.book.update({
        where: {
            code: 'test-45'
        },
        data: {
            stock: {
                decrement: 1
            }
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
