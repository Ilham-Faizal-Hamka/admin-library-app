import supertest from "supertest";
import { web } from "../src/application/web";
import { createBookTest, getBookTest, removeBookTest } from "./test-utils";

describe("POST /books", () => {
    afterEach(async() => {
        await removeBookTest();
    })

    it("should can register new book", async() => {
        const result = await supertest(web)
            .post("/books")
            .send({
                code: "test-45",
                title: "test-title",
                author: "test-author",
                stock: 1
            });

        expect(result.status).toBe(200);
        expect(result.body.data.code).toBe("test-45");
        expect(result.body.data.title).toBe("test-title");
        expect(result.body.data.author).toBe("test-author");
        expect(result.body.data.stock).toBe(1);
    });

    it("should reject when request is invalid", async() => {
        const result = await supertest(web)
            .post("/books")
            .send({
                code: 'test-45',
                title: "",
                author: "",
                stock: 1
            });
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject when request is invalid", async() => {
        const result = await supertest(web)
            .post("/books")
            .send({
                code: 'test-45',
                title: "test-title",
                author: "test-author",
                stock: 0
            });
        
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})

describe("PUT /books/:code", () => {
    beforeEach(async() => {
        await createBookTest();
    });

    afterEach(async() => {
        await removeBookTest();
    });

    it("should can update stock manually", async() => {
        // in case the library is procuring a new book with the same title
        const bookTest = await getBookTest();

        const result = await supertest(web)
            .put("/books/" + bookTest.code)
            .send({
                title: "test-title update",
                author: "test-author update",
                stock: 3
            });

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("test-title update");
        expect(result.body.data.author).toBe("test-author update");
        expect(result.body.data.stock).toBe(3)
    });

    it("should reject when the request is invalid", async () => {
        const bookTest = await getBookTest();

        const result = await supertest(web)
            .put("/books/" + bookTest.code)
            .send({
                title: "",
                author: "",
                stock: 3
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})



