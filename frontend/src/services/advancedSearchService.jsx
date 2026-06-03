import api from "../api/axios";

export const advancedSearchService = {
  searchMeetingRequests: async (params) => {
    const response = await api.get("/AdvancedSearch/meetingRequests", {
      params: params,
      withCredentials: true,
    });

    return response;
  },
};
