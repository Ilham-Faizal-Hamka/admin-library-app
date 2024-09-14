import memberService from "../services/member-service";

const regisgterMember = async(req, res, next) => {
    try {
        const result = await memberService.registerMember(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const borrowBook = async(req, res, next) => {
    try {
        const memberCode = req.params.memberCode;
        const bookCode = req.params.bookCode;

        const result = await memberService.borrowBook(memberCode, bookCode);
        res.status(200).json({
            data: result,
            message: "Book borrowed successfully"
        });
    } catch (e) {
        next(e);
    }
}

const returnBook = async(req, res, next) => {
    try {
        const memberCode = req.params.memberCode;
        const bookCode = req.params.bookCode;

        const result = await memberService.returnBook(memberCode, bookCode);
        res.status(200).json({
            message: "Book returned successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    regisgterMember,
    borrowBook,
    returnBook
}