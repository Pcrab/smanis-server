type userType = "superAdmin" | "admin" | "student";

const allRoutes = [
    "/",
    "/login",
    "/examDetails",
    "/check",
    "/details",
    "/manageDetails",
] as const;
type AllRoutes = typeof allRoutes[number];

const studentRoutes = ["/student", "/exam"] as const;
type StudentRoutes = typeof studentRoutes[number];

const adminRoutes = ["/admin", "/students", "/newStudent", "/exam"] as const;
type AdminRoutes = typeof adminRoutes[number];

const superAdminRoutes = ["/superAdmin", "/admins", "/newAdmin"] as const;
type SuperAdminRoutes = typeof superAdminRoutes[number];

const routes = [...allRoutes, ...adminRoutes, ...superAdminRoutes];
type Routes = AllRoutes | StudentRoutes | AdminRoutes | SuperAdminRoutes;

export {
    userType,
    routes,
    Routes,
    allRoutes,
    AllRoutes,
    studentRoutes,
    StudentRoutes,
    adminRoutes,
    AdminRoutes,
    superAdminRoutes,
    SuperAdminRoutes,
};
