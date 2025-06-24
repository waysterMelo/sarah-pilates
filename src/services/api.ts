const API_BASE_URL = 'http://localhost:3001/api';

// Configuração base do fetch
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// Students API
export const studentsAPI = {
  getAll: async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiRequest(`/students${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/students/${id}`);
  },

  create: async (studentData: any) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  update: async (id: string, studentData: any) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  search: async (query: string) => {
    return apiRequest(`/students/search?q=${encodeURIComponent(query)}`);
  },
};

// Evolution Records API
export const evolutionRecordsAPI = {
  getAll: async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiRequest(`/evolution-records${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/evolution-records/${id}`);
  },

  create: async (recordData: any) => {
    return apiRequest('/evolution-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },

  update: async (id: string, recordData: any) => {
    return apiRequest(`/evolution-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/evolution-records/${id}`, {
      method: 'DELETE',
    });
  },

  getByStudent: async (studentId: string) => {
    return apiRequest(`/evolution-records/student/${studentId}`);
  },

  getProgressReport: async (studentId: string) => {
    return apiRequest(`/evolution-records/reports/progress/${studentId}`);
  },
};

// Schedules API
export const schedulesAPI = {
  getAll: async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiRequest(`/schedules${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/schedules/${id}`);
  },

  create: async (scheduleData: any) => {
    return apiRequest('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  },

  update: async (id: string, scheduleData: any) => {
    return apiRequest(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/schedules/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/schedules/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Instructors API
export const instructorsAPI = {
  getAll: async (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiRequest(`/instructors${queryString}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/instructors/${id}`);
  },

  create: async (instructorData: any) => {
    return apiRequest('/instructors', {
      method: 'POST',
      body: JSON.stringify(instructorData),
    });
  },

  update: async (id: string, instructorData: any) => {
    return apiRequest(`/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instructorData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/instructors/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },

  getRevenue: async (period = 'month') => {
    return apiRequest(`/dashboard/revenue?period=${period}`);
  },

  getTodaySchedules: async () => {
    return apiRequest('/dashboard/schedules/today');
  },

  getUpcomingSchedules: async () => {
    return apiRequest('/dashboard/schedules/upcoming');
  },

  getActiveStudents: async () => {
    return apiRequest('/dashboard/students/active');
  },

  getMonthlyReport: async () => {
    return apiRequest('/dashboard/reports/monthly');
  },
};

export default {
  auth: authAPI,
  students: studentsAPI,
  evolutionRecords: evolutionRecordsAPI,
  schedules: schedulesAPI,
  instructors: instructorsAPI,
  dashboard: dashboardAPI,
};