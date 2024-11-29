import { Admin, Doctor, Patient } from "@prisma/client";

export type TCreateAdmin = {
  password: string;
  admin: Pick<Admin, "name" | "email" | "contactNumber">;
};

export type TCreateDoctor = {
  password: string;
  doctor: Doctor;
};
export type TCreatePatient = {
  password: string;
  patient: Patient;
};
