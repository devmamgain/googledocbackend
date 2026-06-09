const express = require("express");

const {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    shareDocument,
} = require("../controllers/documentController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
    .post(createDocument)
    .get(getDocuments);

router
    .route("/:id")
    .get(getDocumentById)
    .put(updateDocument)
    .delete(deleteDocument);

router.post(
    "/:id/share",
    shareDocument
);

module.exports = router;