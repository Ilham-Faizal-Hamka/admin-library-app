import supertest from "supertest";
import { web } from "../src/application/web";
import { createBookTest, removeBookTest, getBookTest, createMemberTest, removeMemberTest, getMemberTest, createBorrowedBookTest, removeBorrowedBookTest } from "./test-utils";


describe("POST /members", () => { 
    afterEach(async() => {
        await removeMemberTest();
    });

    it("should can create member", async() => {
        const result = await supertest(web)
            .post("/members")
            .send({
                code: "test-45",
                name: "test-name"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.code).toBe("test-45");
        expect(result.body.data.name).toBe("test-name");
    });

    it("should reject when request is invalid", async() => {
        const result = await supertest(web)
            .post("/members")
            .send({
                code: "test-45",
                name: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("POST /members/:memberCode/borrow/:bookCode", () => {
    beforeEach(async() => {
        await createMemberTest();
        await createBookTest();
    });

    afterEach(async() => {
        await removeBorrowedBookTest();
        await removeBookTest();
        await removeMemberTest();
    });

    it("should can borrow book", async() => {
        const member = await getMemberTest();
        const book = await getBookTest();

        const result = await supertest(web)
            .post("/members/" + member.code + "/borrow/" + book.code);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Book borrowed successfully");
        expect(result.body.data.memberCode).toBe(member.code);
        expect(result.body.data.bookCode).toBe(book.code);
        expect(result.body.data.book.stock).toBe(book.stock - 1);
    });

    it("should reject if member is not found", async() => {
        const book = await getBookTest();
        const result = await supertest(web)
            .post("/members/test-46/borrow/" + book.code);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if book is not found", async() => {
        const member = await getMemberTest();
        const result = await supertest(web)
            .post("/members/" + member.code + "/borrow/test-46");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("POST /members/:memberCode/return/:bookCode", () => {
    beforeEach(async()=> {
        await createMemberTest();
        await createBookTest();
        await createBorrowedBookTest();
    });

    afterEach(async() => {
        await removeBorrowedBookTest();
        await removeBookTest();
        await removeMemberTest();
    })

    it("should can return book", async() => {
        const member = await getMemberTest();
        const book = await getBookTest();

        const result = await supertest(web)
            .delete("/members/" + member.code + "/return/" + book.code);
        
        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Book returned successfully");
    })

    it("should reject if member who borrow the book and book does not match", async() => {
        
        const result = await supertest(web)
            .delete("/members/test-46/return/test-45");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    })
});