import api from "../api/axios";

const DocumentService = {
    getDocuments(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/documents", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getDocument(id) {
        return api.get(`/documents/${id}`);
    },

    uploadDocument(formData, employeeId, documentType, documentName) {
        const params = {
            employeeId,
            documentType
        };
        if (documentName) {
            params.documentName = documentName;
        }

        return api.post("/documents/upload", formData, {
            params
        });
    },

    deleteDocument(id) {
        return api.delete(`/documents/${id}`);
    },

    downloadDocument(id) {
        return api.get(`/documents/${id}/download`, {
            responseType: "blob"
        });
    },

    getMyDocuments(page = 0, size = 10) {
        return api.get("/documents/my-documents", {
            params: {
                page,
                size
            }
        });
    },

    searchDocuments(keyword, page = 0, size = 10) {
        return api.get("/documents/search", {
            params: {
                keyword,
                page,
                size
            }
        });
    }
};

export default DocumentService;
