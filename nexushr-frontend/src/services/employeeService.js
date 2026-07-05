import api from "../api/axios";

const parseRootJson = (text) => {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (char === "\\") {
            escaped = true;
            continue;
        }
        if (char === '"') {
            inString = !inString;
            continue;
        }
        if (inString) {
            continue;
        }
        if (char === "{") {
            depth += 1;
        } else if (char === "}") {
            depth -= 1;
            if (depth === 0) {
                const trimmed = text.slice(0, i + 1);
                return JSON.parse(trimmed);
            }
        }
    }
    return JSON.parse(text);
};

const parseEmployeeListResponse = (response) => {
    if (typeof response.data === "string") {
        try {
            response.data = JSON.parse(response.data);
        } catch (error) {
            response.data = parseRootJson(response.data);
        }
    }
    return response;
};

const EmployeeService = {

    getEmployees(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/employees", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getEmployee(id) {

        return api.get(`/employees/${id}`);

    },

    createEmployee(employee) {

        return api.post("/employees", employee);

    },

    updateEmployee(id, employee) {

        return api.put(`/employees/${id}`, employee);

    },

    deleteEmployee(id) {

        return api.delete(`/employees/${id}`);

    },

    searchEmployees(keyword, page = 0, size = 10) {

        return api.get("/employees/search", {

            params: {

                keyword,

                page,

                size

            }

        });

    },

    exportExcel() {

        return api.get("/employees/export/excel", {

            responseType: "blob"

        });

    }

};

export default EmployeeService;