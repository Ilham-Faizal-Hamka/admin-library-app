import { prismaClient } from "../application/database";
import { validate } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import { getBookValidation } from "../validations/book-validation";
import { getMemberValidation, registerMemberValidation } from "../validations/member-validation";

const checkBookExistence = async(bookCode) => {
    bookCode = validate(getBookValidation, bookCode);

    const book = await prismaClient.book.findUnique({
        where: {
            code: bookCode
        },
        include: {
            borrowedBy: true
        }
    });

    if (!book) {
        throw new ResponseError(404, "Book not found");
    }

    return book;
}

const checkMemberExistence = async(memberCode) => {
    memberCode = validate(getMemberValidation, memberCode);

    const member = await prismaClient.member.findUnique({
        where: {
            code: memberCode
        },
        include: {
            borrows: true
        }
    });

    if (!member) {
        throw new ResponseError(404, "Member not found");
    }

    return member;
}

const registerMember = async(request) => {
    const member = validate(registerMemberValidation, request);

    const countMember = await prismaClient.member.count({
        where: {
            code: member.code
        }
    });

    if (countMember === 1) {
        throw new ResponseError(400, "Member already exists");
    }

    return prismaClient.member.create({
        data: member,
        select: {
            name: true,
            code: true,
            penalizedUntil: true,
        }
    });
};

const borrowBook = async(memberCode, bookCode) => {
    const member = await checkMemberExistence(memberCode);
    const book = await checkBookExistence(bookCode);

    // check if the book is available
    if(book.stock === 0) {
        throw new ResponseError(400, "Book is out of stock");
    }
    
    //check member condition
    const now = new Date();
    if(member.penalizedUntil) {
        if(member.penalizedUntil > now) {
            throw new ResponseError(400, `Member is penalized until ${member.penalizedUntil}`)
        } else {
            await prismaClient.member.update({
                where: {
                    code: member.code
                },
                data: {
                    penalizedUntil: null
                }
            });
        }
    }

    if(member.borrows.length >= 2) {
        throw new ResponseError(400, "Member cannot borrow more than 2 books")
    }

    // book stock -1
    await prismaClient.book.update({
        where: {
            code: book.code
        },
        data: {
            stock: book.stock - 1,
        }
    });

    // Borrow the book
    return prismaClient.borrowedBook.create({
        data: {
            memberCode: member.code,
            bookCode: book.code,
            borrowedAt: new Date()
        }, 
        include: {
            member: true,
            book: true
        }
    });
}

const returnBook = async(memberCode, bookCode) => {
    const member = await checkMemberExistence(memberCode);
    const book = await checkBookExistence(bookCode);

    // check if the book was borrowed by the member
    const bookBorrowed = await prismaClient.borrowedBook.findFirst({
        where: {
            bookCode: book.code,
            memberCode: member.code
        },
        select: {
            memberCode: true,
            bookCode: true,
            borrowedAt: true
        }
    });

    if (!bookBorrowed) {
        throw new ResponseError(404, "Books are not borrowed by the member concerned");
    }

    // calculate the number of days the book was borrowed
    const now = new Date();
    const borrowedAt = new Date(bookBorrowed.borrowedAt);
    const daysBorrowed = (now - borrowedAt) / (1000 * 60 * 60 * 24);
    console.info(now);
    console.info(borrowedAt);
    console.info(daysBorrowed);

    // apply penalty if borrow more than 7 days
    if(daysBorrowed > 7) {
        // penalized until 3 days from now
        const penalized = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 3))
        await prismaClient.member.update({
            where: {
                code: member.code
            },
            data: {
                penalizedUntil: penalized
            }
        });
    }

    // stock update
    await prismaClient.book.update({
        where: {
            code: book.code
        },
        data: {
            stock: book.stock + 1,
        }
    });

    return prismaClient.borrowedBook.delete({
        where: {
            memberCode_bookCode: {
                memberCode: member.code,
                bookCode: book.code
            }
        },
        include: {
            member: true,
            book: true
        }
    });
}

export default {
    registerMember,
    borrowBook,
    returnBook
};
