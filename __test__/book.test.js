import supertest from "supertest";
import { web } from "../src/application/web";

describe("POST /books", () => {
    it("should can register new book", async() => {
        const result = await supertest(web)
            .post("/books")
            .send({
                code: "JK-45",
                title: "Harry Potter",
                author: "J.K Rowling",
                stock: 1
            });

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("Harry Potter");
        expect(result.body.data.author).toBe("J.K Rowling");
        expect(result.body.data.stock).toBe(1);
        expect(result.body.data.code).toBe("JK-45");
    })
})