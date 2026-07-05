import api from "../api/axios";

const CompanyService = {
    async getCompanies(page = 0, size = 10, sortBy = "id", direction = "asc") {
        try {
            return await api.get("/companies", {
                params: {
                    page,
                    size,
                    sortBy,
                    direction
                }
            });
        } catch (e) {
            // Fallback: some backends expose a singular /company endpoint returning an array
            try {
                const res = await api.get("/company");
                // If backend returned an array, wrap into expected shape (data as array)
                return res;
            } catch (fallbackError) {
                throw e;
            }
        }
    },

    getCompany(id) {
        return api.get(`/companies/${id}`);
    },

    async createCompany(company) {
        // Map UI fields to backend expected names
        const payload = {
            company_name: company.name ?? company.company_name ?? "",
            email: company.email ?? "",
            mobile: company.phone ?? company.mobile ?? "",
            location: company.address ?? company.location ?? "",
            gst_number: company.registrationNumber ?? company.gst_number ?? company.pan_number ?? ""
        };

        try {
            console.log("Creating company payload:", payload);
            const res = await api.post("/companies", payload);
            console.log("Create response:", res);
            return res;
        } catch (e) {
            // Fallback to singular endpoint if plural not supported
            try {
                console.log("Falling back to /company payload:", payload);
                const res2 = await api.post("/company", payload);
                console.log("Create fallback response:", res2);
                return res2;
            } catch (fallback) {
                throw fallback;
            }
        }
    },

    async updateCompany(id, company) {
        const payload = {
            company_name: company.name ?? company.company_name ?? "",
            email: company.email ?? "",
            mobile: company.phone ?? company.mobile ?? "",
            location: company.address ?? company.location ?? "",
            gst_number: company.registrationNumber ?? company.gst_number ?? company.pan_number ?? ""
        };

        try {
            return await api.put(`/companies/${id}`, payload);
        } catch (e) {
            try {
                return await api.put(`/company/${id}`, payload);
            } catch (fallback) {
                throw fallback;
            }
        }
    },

    async deleteCompany(id) {
        try {
            return await api.delete(`/companies/${id}`);
        } catch (e) {
            try {
                return await api.delete(`/company/${id}`);
            } catch (fallback) {
                throw fallback;
            }
        }
    },

    searchCompanies(keyword, page = 0, size = 10) {
        return api.get("/companies/search", {
            params: {
                keyword,
                page,
                size
            }
        }).catch(async (e) => {
            // Fallback: if search endpoint not available, fetch the singular list and filter locally
            try {
                const res = await api.get("/company");
                const list = Array.isArray(res.data) ? res.data : res.data?.content ?? res.data?.data ?? [];
                const filtered = list.filter((c) => {
                    const q = String(keyword).toLowerCase();
                    return (
                        String(c.name ?? c.company_name ?? "").toLowerCase().includes(q) ||
                        String(c.email ?? "").toLowerCase().includes(q) ||
                        String(c.phone ?? "").toLowerCase().includes(q)
                    );
                });
                return { data: filtered };
            } catch (fallback) {
                throw e;
            }
        });
    },

    exportExcel() {
        return api.get("/companies/export/excel", {
            responseType: "blob"
        });
    }
};

export default CompanyService;
