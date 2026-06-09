const express = require("express");
const multer = require("multer");

const {
    uploadFile,
} = require("../controllers/uploadController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },

    filename(req, file, cb) {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    },
});

const fileFilter = (
    req,
    file,
    cb
) => {
    const allowedTypes = [
        "text/plain",
        "text/markdown",
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only TXT and MD files allowed"
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
});

router.post(
    "/",
    protect,
    upload.single("file"),
    uploadFile
);

module.exports = router;