const Document = require("../models/Document");
const User = require("../models/User");

const createDocument = async (req, res) => {
    try {
        const { title } = req.body;

        const document = await Document.create({
            title: title || "Untitled Document",
            owner: req.user._id,
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const getDocuments = async (req, res) => {
    try {
        const ownedDocuments =
            await Document.find({
                owner: req.user._id,
            })
                .populate(
                    "owner",
                    "name email"
                )
                .sort({
                    updatedAt: -1,
                });

        const sharedDocuments =
            await Document.find({
                sharedWith: req.user._id,
            })
                .populate(
                    "owner",
                    "name email"
                )
                .sort({
                    updatedAt: -1,
                });

        res.json({
            ownedDocuments,
            sharedDocuments,
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const getDocumentById = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            )
                .populate(
                    "owner",
                    "name email"
                )
                .populate(
                    "sharedWith",
                    "name email"
                );

        if (!document) {
            return res.status(404).json({
                success: false,
                message:
                    "Document not found",
            });
        }

        const isOwner =
            document.owner._id.toString() ===
            req.user._id.toString();

        const isShared =
            document.sharedWith.some(
                (user) =>
                    user._id.toString() ===
                    req.user._id.toString()
            );

        if (!isOwner && !isShared) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        res.json(document);
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const updateDocument = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                success: false,
                message:
                    "Document not found",
            });
        }

        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only owner can edit",
            });
        }

        document.title =
            req.body.title ??
            document.title;

        document.content =
            req.body.content ??
            document.content;

        const updated =
            await document.save();

        res.json(updated);
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const deleteDocument = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                success: false,
                message:
                    "Document not found",
            });
        }

        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only owner can delete",
            });
        }

        await document.deleteOne();

        res.json({
            success: true,
            message:
                "Document deleted",
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

const shareDocument = async (
    req,
    res
) => {
    try {
        const { email } = req.body;

        const document =
            await Document.findById(
                req.params.id
            );

        if (!document) {
            return res.status(404).json({
                success: false,
                message:
                    "Document not found",
            });
        }

        if (
            document.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only owner can share",
            });
        }

        const user =
            await User.findOne({
                email,
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        if (
            user._id.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot share with yourself",
            });
        }

        const alreadyShared =
            document.sharedWith.includes(
                user._id
            );

        if (alreadyShared) {
            return res.status(400).json({
                success: false,
                message:
                    "Already shared",
            });
        }

        document.sharedWith.push(
            user._id
        );

        await document.save();

        res.json({
            success: true,
            message:
                "Document shared successfully",
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
};

module.exports = {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    shareDocument,
};