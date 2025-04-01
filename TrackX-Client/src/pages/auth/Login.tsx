import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks";
import { lazy } from "react";

const FormInputWrapperAtom = lazy(() => import("@/atmos/FormInputWrapperAtom"));

export default function LoginForm() {
  const { formik, isPending } = useLogin();
  return (
    <Card className="w-full max-w-md bg-[#1E1E1E] text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4"
          autoComplete="off"
        >
          <FormInputWrapperAtom
            Icon={Mail}
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            name="email"
          />
          <FormInputWrapperAtom
            Icon={Lock}
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            name="password"
          />
          <Button
            type="submit"
            className="w-full bg-[#00BFFF] hover:bg-[#33CCFF] text-white"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-[#00BFFF] hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}