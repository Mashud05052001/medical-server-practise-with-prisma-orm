import { Request, Response, Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialitiesRoutes } from "../modules/specialities/specialities.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";

const router = Router();

const moduleRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/admin", route: AdminRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/specialities", route: SpecialitiesRoutes },
  { path: "/doctor", route: DoctorRoutes },
  { path: "/patient", route: PatientRoutes },
  { path: "/schedule", route: ScheduleRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const AllRoutes = router;
