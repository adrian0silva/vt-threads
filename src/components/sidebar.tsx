import { LayoutGridIcon, PackageIcon, ShoppingBasketIcon } from "lucide-react";
import SidebarButton from "./sidebar-button";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white">
      {/* Imagem */}
      <div className="px-32 py-6">
        <h1 className="text-2xl font-bold">VTHREADS</h1>
      </div>
      {/* Botoes */}
      <div className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">
          <LayoutGridIcon size={20} />
          Forums
        </SidebarButton>
        <SidebarButton href="/forums/vale-tudo">
          <PackageIcon size={20} />
          Vale Tudo
        </SidebarButton>

        <SidebarButton href="/forums/gaming">
          <ShoppingBasketIcon size={20} />
          Gaming Forum
        </SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
