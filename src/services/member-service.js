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
            penalty: true,
        }
    });
};

const borrowBook = async(memberCode, bookCode) => {
    const member = await checkMemberExistence(memberCode);
    const book = await checkBookExistence(bookCode);

    //check member condition
    if(member.penalty) {
        throw new ResponseError(400, "Member is penalized")
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

    const bookBorrowed = await prismaClient.bookBorrowed.findUnique({
        where: {
            memberCode: member.code,
            bookCode: book.code
        }
    });

    if (!bookBorrowed) {
        throw new ResponseError(404, "Book not found");
    }

    if (bookBorrowed.returned) {
        throw new ResponseError(400, "Book already returned");
    }

    if(!bookBorrowed || bookBorrowed.memberCode !== member.code){
        throw new ResponseError(404, "This book was not borrowed by this member");
    }

    // calculate the number of days the book was borrowed
    const now = new Date();
    const borrowedAt = new Date(bookBorrowed.borrowedAt);
    const daysBorrowed = (now - borrowedAt) / (1000 * 60 * 60 * 24);

    // apply penalty if borrow more than 7 days
    if(daysBorrowed > 7) {
        await prismaClient.member.update({
            where: {
                code: member.code
            },
            data: {
                penalty: true
            }
        });
    }

    // return the book
    const bookReturned = await prismaClient.bookBorrowed.update({
        where: {
            memberCode: member.code,
            bookCode: book.code
        },
        data: {
            returnedAt: new Date(now),
            returned: true
        },
        include: {
            member: true,
            book: true
        }
    });

    await prismaClient.book.update({
        where: {
            code: bookCode
        },
        data: {
            stock: book.stock + 1
        },
        select: {
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });

    return bookReturned;
}

export default {
    registerMember,
    borrowBook,
    returnBook
};
