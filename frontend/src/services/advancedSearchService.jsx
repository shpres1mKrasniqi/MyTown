import api from "../api/axios";

export const advancedSearchService = {
  searchMeetingRequests: async (params) => {
    const response = await api.get("/AdvancedSearch/meetingRequests", {
      params: params,
      withCredentials: true,
    });

    return response;
  },
  searchStaff: async (params) => {
  const response = await api.get("/AdvancedSearch/staff", {
    params,
    withCredentials: true,
  });

  return response;
},

searchDepartments: (params) =>
  api.get("/AdvancedSearch/departments", {
    params,
    withCredentials: true,
  }),
   searchIssues: async (filters) => {
    const params = {
      ...filters,
      title: filters.title?.trim() || "",
      komunaName: filters.komunaName?.trim() || "",
    };
    const response = await api.get("/AdvancedSearch/issues", {
      params,
      withCredentials: true,
    });
    return {
      data: {
        items: response.data,
        totalCount: response.data.length,
      },
    };
  },
};