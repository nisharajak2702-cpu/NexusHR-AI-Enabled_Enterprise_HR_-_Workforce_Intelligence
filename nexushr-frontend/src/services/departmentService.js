import api from "../api/axios";

const DepartmentService = {
    getDepartments(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/department", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getDepartment(id) {
        return api.get("/department", {
            params: {
                id
            }
        });
    },

    createDepartment(department) {
        return api.post("/department", department);
    },

    updateDepartment(id, department) {
        return api.post("/department", {
            action: "update",
            id,
            ...department
        });
    },

    deleteDepartment(id) {
        return api.post("/department", {
            action: "delete",
            id
        });
    },

    searchDepartments(keyword, page = 0, size = 10) {
        return api.get("/department/search", {
            params: {
                keyword,
                page,
                size
            }
        });
    },

    exportExcel() {
        return api.get("/department/export/excel", {
            responseType: "blob"
        });
    }
};

export default DepartmentService;
