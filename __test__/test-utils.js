import { prismaClient } from "../src/application/database";

// remove utils
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
            memberCode: {
                contains: "test"
            },
            bookCode: {
                contains: "test"
            }
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

// create utils
export const createBookTest = async () => {
    await prismaClient.book.createMany({
        data: [
            {
                code: 'test-45',
                title: 'test-title',
                author: 'test-author',
                stock: 1
            },
            {
                code: 'test-46',
                title: 'test-title 2',
                author: 'test-author 2',
                stock: 2
            },
            {
                code: 'test-47',
                title: 'test-title 3',
                author: 'test-author 3',
                stock: 1
            }
        ]
    });
};

export const createMemberTest= async() => {
    const now = new Date();
    const penalty = new Date( now.getTime() + (2 * 24 * 60 * 60 * 1000)) 
    await prismaClient.member.createMany({
        data: [
            {
                code: 'test-45',
                name: 'test-name'
            },
            {
                code: 'test-46',
                name: 'test-name 2'
            },
            {
                code: 'test-penalized',
                name: 'test-name penalized',
                penalizedUntil: penalty
            }
        ]
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

export const createExceedDeadlineBorrowedBooks = async() => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - (2 * 7 * 24 * 60 * 60 * 1000));
    await prismaClient.borrowedBook.create({
        data: {
            memberCode: 'test-46',
            bookCode: 'test-46',
            borrowedAt: twoWeeksAgo
        }
    });
    await prismaClient.book.update({
        where: {
            code: 'test-46'
        },
        data: {
            stock: {
                decrement: 1
            }
        }
    });
}

// get utils 
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

export const getMemberPenalizedTest = async() => {
    return await prismaClient.member.findUnique({
        where: {
            code: "test-penalized"
        }
    });
}

export const getMemberExceedDeadlineTest = async() => {
    return await prismaClient.member.findUnique({
        where: {
            code: "test-46"
        }
    });
}

export const getBookExceedDeadlineTest = async() => {
    return await prismaClient.book.findUnique({
        where: {
            code: "test-46"
        }
    });
}
