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

const adminRoutes = ["/students", "/newStudent", "/exam"] as const;
type AdminRoutes = typeof adminRoutes[number];

const superAdminRoutes = ["/admins", "/newAdmin"] as const;
type SuperAdminRoutes = typeof superAdminRoutes[number];

const routes = [...allRoutes, ...adminRoutes, ...superAdminRoutes];
type Routes = AllRoutes | AdminRoutes | SuperAdminRoutes;

export {
    userType,
    routes,
    Routes,
    allRoutes,
    AllRoutes,
    adminRoutes,
    AdminRoutes,
    superAdminRoutes,
    SuperAdminRoutes,
};
