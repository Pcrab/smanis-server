import {
    userType,
    adminRoutes,
    AdminRoutes,
    allRoutes,
    AllRoutes,
    superAdminRoutes,
    SuperAdminRoutes,
    Routes,
    // routes,
} from "./types.js";

const isAllRoutes = (route: Routes): route is AllRoutes => {
    if (allRoutes.includes(route as AllRoutes)) {
        return true;
    }
    return false;
};

const isAdminRoutes = (route: Routes): route is AdminRoutes => {
    if (adminRoutes.includes(route as AdminRoutes)) {
        return true;
    }
    return false;
};

const isSuperAdminRoutes = (route: Routes): route is SuperAdminRoutes => {
    if (superAdminRoutes.includes(route as SuperAdminRoutes)) {
        return true;
    }
    return false;
};

// const isRoutes = (route: string): route is Routes => {
//     if (routes.includes(route as Routes)) {
//         return true;
//     }
//     return false;
// };

const canJump = (userType: userType, jumpTo: Routes): boolean => {
    if (
        isAllRoutes(jumpTo) ||
        (isAdminRoutes(jumpTo) && userType === "admin") ||
        (isSuperAdminRoutes(jumpTo) && userType === "superAdmin")
    ) {
        return true;
    }
    return false;
};

export { isAllRoutes, isAdminRoutes, isSuperAdminRoutes, canJump };
