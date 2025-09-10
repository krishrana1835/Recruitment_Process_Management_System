import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { Images } from "@/constants/Images";
import {motion} from "framer-motion"
import { useAuth } from "@/route_protection/AuthContext";

interface menu{
    name: string;
    path: string;
}

const AdminItems = [
	{ name: "User Management", path: "/dashboard/users" },
	{ name: "Job Management", path: "/dashboard/employees" },
	{ name: "Candidate Management", path: "/dashboard/roles" },
	{ name: "Resume Review & Sortlisting", path: "/dashboard/assign-roles" },
	{ name: "Interview Scheduling", path: "/dashboard/interview-schedule" },
	{ name: "Feedback & Evaluation", path: "/dashboard/feedback" },
	{ name: "Reports & Analytics", path: "/dashboard/reports" },
	{ name: "Notifications", path: "/dashboard/notifications" },
	{ name: "Settings", path: "/dashboard/settings" },
];

const HRItems = [
    {name: "Candidate Profiles", path: "/dashboard/candidate"}
]

export default function Dashboard() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
    // const role = sessionStorage.getItem('role');
    const [loadMenu, setLoadMenu] = useState<menu[]>([{name: 'Logout', path: '/'}]);
    const [panelName, setPanelName] = useState<string | null>('');

	const {user} = useAuth();

    const MotionLink = motion.create(Link);
    const Motionbutton = motion.create(Button)

    useEffect(()=>{
		if(!user) return;
        if(user.role == 'Admin'){
            setLoadMenu(AdminItems)
        }else{
            setLoadMenu(HRItems)
        }
        setPanelName(user.role)
    },[])

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-64"
				} md:translate-x-0 md:static md:block`}
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-center h-16 border-b">
						<span className="text-xl font-bold">{panelName} Panel</span>
					</div>
					<nav className="flex-1 px-4 py-6 space-y-2">
						{loadMenu.map((item) => (
							<MotionLink
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", duration: 0.05 }}
								key={item.name}
								to={item.path}
								className="block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition"
								onClick={() => setSidebarOpen(false)}
							>
								{item.name}
							</MotionLink>
						))}
					</nav>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Navigation Bar */}
				<header className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							className="md:hidden"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<Menu className="w-6 h-6" />
						</Button>
						<span className="font-semibold"><img src={Images.companyLogo} className="h-7 w-auto"></img></span>
					</div>
					<div>
						<Motionbutton
						className="cursor-pointer"
                        whileHover={{ boxShadow: '0px 0px 2px 2px #ddd' }}
                        transition={{duration: 0.2}}
                         variant="outline">Logout</Motionbutton>
					</div>
				</header>

				{/* Dashboard Content */}
				<main className="flex-1 p-6">
					<Card className="p-6">
						<h2 className="text-2xl font-bold mb-4">Welcome, Admin!</h2>
					</Card>
				</main>
			</div>
		</div>
	);
}