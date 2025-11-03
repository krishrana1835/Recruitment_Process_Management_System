import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Images } from "@/constants/Images";
import { useAuth } from "@/route_protection/AuthContext";

const WelcomePage = () => {
  const { user } = useAuth();
  const role = user?.role ?? "User";

  return (
    <div className="flex items-center justify-center h-full bg-gray-50 text-gray-900 px-4 rounded-md">
      <Card className="w-full max-w-lg bg-white border border-gray-200 shadow-xl rounded-xl text-center transition-all duration-700 hover:shadow-gray-300/50">
        <CardHeader>
          <div className="flex flex-col items-center">
            <img
              src={Images.companyLogo}
              alt="Roima Intelligence Logo"
              className="w-36 mb-4"
            />
            <CardTitle className="text-2xl font-semibold text-[#004080]">
              Welcome to Roima Intelligence
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Empowering your digital transformation journey
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <h2 className="text-xl font-medium mt-4 text-gray-800">
            Hello, <span className="font-semibold text-[#004080]">{role}</span> 👋
          </h2>

          <hr className="my-4 border-gray-200" />

          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome to your Roima dashboard. Explore your{" "}
            {role === "Candidate"
              ? "job applications and opportunities"
              : "management tools and analytics"}{" "}
            designed to streamline intelligent automation and productivity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
