import bookService from "../services/book-service";

const registerBook = async(req, res, next) => {
    try {
        const result = await bookService.registerBook(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async(req, res, next) => {
    try {
        const code = req.params.code;
        const request = req.body;
        request.code = code;
        const result = await bookService.update(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    registerBook,
    update
}
