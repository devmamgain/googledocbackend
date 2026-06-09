const fs = require("fs");

const uploadFile = async (
    req,
    res
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "No file uploaded",
            });
        }

        const content =
            fs.readFileSync(
                req.file.path,
                "utf-8"
            );

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            content,
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

module.exports = {
    uploadFile,
};