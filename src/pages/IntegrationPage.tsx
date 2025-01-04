import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Itegrations from "@/components/Itegrations";
export default function IntegrationPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col  md:h-screen bg-gradient-to-b from-zinc-900 to-zinc-900">
        <div className="md:hidden">{/* <Header /> */}</div>



        <div className="flex-1 p-5 mt-3">
          <Itegrations />
        </div>
      </div>
    </div>
  );
}
