import { User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegister } from "@/hooks";
import { lazy } from "react";
const FormInputWrapperAtom = lazy(() => import("@/atmos/FormInputWrapperAtom"));

export default function RegisterForm() {
  const { formik, isPending } = useRegister();

  return (
    <Card className="w-full max-w-md bg-[#1E1E1E] text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Register
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <FormInputWrapperAtom
            Icon={User}
            name="name"
            onChange={formik.handleChange}
            placeholder="Name"
            type="text"
            value={formik.values.name}
          />
          <FormInputWrapperAtom
            Icon={Mail}
            name="email"
            onChange={formik.handleChange}
            placeholder="Email"
            type="email"
            value={formik.values.email}
          />
          <FormInputWrapperAtom
            Icon={Lock}
            name="password"
            placeholder="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <FormInputWrapperAtom
            Icon={Lock}
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            name="confirmPassword"
            type="password"
          />
          <Button
            type="submit"
            className="w-full bg-[#00BFFF] hover:bg-[#33CCFF] text-white"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-[#00BFFF] hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}