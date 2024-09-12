import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(3000, () => {
    logger.info("server running on port 3000");
});
