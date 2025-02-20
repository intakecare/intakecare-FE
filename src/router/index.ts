import {
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    RouteRecordRaw,
} from "vue-router";
import {useUserStore} from "@/stores/user";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeViews/HomeView.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import("@/views/HomeViews/AboutView.vue"),
    },
    {
        path: "/project",
        name: "Project",
        component: () => import("../views/Project.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/HomeViews/LoginView.vue"),
    },
    // {
    //     path: "/signup",
    //     name: "Signup",
    //     component: () => import("../views/Signup.vue"),
    // },
    // /*{
    //   path: "/profile",
    //   name: "Profile",
    //   component: () => import("../views/Profile.vue"),
    //},*/
    {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/HomeViews/UserProfileView.vue"),
    },
    {
        path: "/completeProfile",
        name: "CompleteProfile",
        component: () => import("../views/SetupWizard.vue"),
    },
    // {
    //     path: "/signup",
    //     name: "Signup",
    //     component: () => import("../views/Signup.vue"),
    // },
    {
        path: "/patients",
        name: "Patients",
        component: () => import("../views/DoctorViews/PatientListView.vue"),
    },
    {
        path: "/showPatient",
        name: "PatientDetail",
        component: () => import("../views/DoctorViews/PatientDetailView.vue"),
    },
    {
        path: "/patientPage",
        name: "PatientPage",
        component: () => import("../views/PatientPage.vue"),
    },
    {
        path: "/showPatientTherapyDetail",
        name: "PatientTherapyDetail",
        component: () => import("../views/PatientTherapyDetail.vue"),
    },
    // {
    //     path: "/dashboard",
    //     name: "Dashboard",
    //     component: () => import("../views/DashboardProva.vue"),
    // },
    // {
    //     path: "/dashboard/users",
    //     name: "DashboardUsers",
    //     component: () => import("../views/DashboardUsers.vue"),
    // },
    // {
    //     path: "/dashboard/users/doctors",
    //     name: "DashboardDoctors",
    //     component: () => import("../views/DashboardDoctors.vue"),
    // },
    // {
    //     path: "/dashboard/users/structures",
    //     name: "DashboardStructures",
    //     component: () => import("../components/DashboardStructures.vue"),
    // },
    // {
    //     path: "/dashboard/report",
    //     name: "DashboardReport",
    //     component: () => import("../components/DashboardReport.vue"),
    // }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

const canUserAccess = (to: RouteLocationNormalized): boolean => {
    /* Check if the user is logged in and if the route is protected */
    // Define the protected routes
    const protectedRoutes = ["Profile", "CompleteProfile"];
    const doctorReserved = ["Patients", "PatientDetail"];
    const adminReserved = ["Dashboard", "DashboardUsers", "DashboardDoctors", "DashboardStructures"];
    const patientReserved = ["PatientTherapies", "PatientTherapyDetail"]
    // Get the user store
    const user = useUserStore();

    // Check if the user has permission to access the route
    if (protectedRoutes.includes(to.name as string)) {
        if (user.user_type) {
            return true;
        }
        return false;
    }

    if (adminReserved.includes(to.name as string)) {
        if (user.user_type === "admin_itc" || user.user_type === "admin") {
            return true;
        }
        return false;
    }

    if (doctorReserved.includes(to.name as string)) {
        if (user.user_type === "doctor") {
            return true;
        }
        return false;
    }

    if (patientReserved.includes(to.name as string)) {
        if (user.user_type === "patient") {
            return true;
        }
        return false;
    }
    return true;
};

router.beforeEach(async (to) => {
    const canAccess = canUserAccess(to);
    if (!canAccess) return "/login";
});

export default router;
