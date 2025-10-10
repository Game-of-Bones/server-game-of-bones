"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likesController_1 = require("../controllers/likesController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Route to get the number of likes for a post
// This is a public route, no authentication needed
router.get("/api/posts/:postId/likes", likesController_1.getLikesByPostId);
// Route to add or remove a like from a post
// This is a protected route, the user must be authenticated
// The toggleLike controller handles both liking and unliking
router.post("/api/posts/:postId/like", auth_1.verifyToken, likesController_1.toggleLike);
exports.default = router;
//# sourceMappingURL=likes.js.map