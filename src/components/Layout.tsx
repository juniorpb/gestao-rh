
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle,
  Settings,
  User as UserIcon,
  Search,
  ChevronDown,
  ChevronRight,
  Bell
} from 'lucide-react';
import { User, UserRole } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ 'Projetos': true });
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  interface MenuItem {
    name: string;
    icon: any;
    path?: string;
    subItems?: { name: string; icon: any; path: string }[];
  }

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'Projetos', 
      icon: Briefcase, 
      subItems: [
        { name: 'Lista de Projetos', icon: Briefcase, path: '/projects' }
      ] 
    },
  ];

  if (user.role === UserRole.GESTOR) {
    const projetosMenu = menuItems.find(m => m.name === 'Projetos');
    if (projetosMenu && projetosMenu.subItems) {
      projetosMenu.subItems.push({ name: 'Cadastrar Projeto', icon: PlusCircle, path: '/projects/new' });
    }
    menuItems.push({ name: 'Tabelas de Bolsas', icon: Settings, path: '/bolsas' });
  }

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-800">
      {/* Sidebar Navigation */}
        <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-500 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold shrink-0 shadow-sm text-xs">M</div>
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-sm font-bold tracking-tight text-slate-900 block leading-none">MVP GESTÃO RH</span>
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1 block">Gestão de Recursos</span>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
          {menuItems.map((item, idx) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus[item.name];
            const isActive = item.path ? location.pathname === item.path : false;
            
            return (
              <div key={item.name} className="space-y-1">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded transition-all group relative duration-200",
                      isActive 
                        ? "bg-slate-100 text-slate-900 font-semibold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon size={18} className={cn("shrink-0", !isSidebarOpen && "mx-auto")} />
                    {isSidebarOpen && (
                      <span className="text-xs font-medium">
                        {item.name}
                      </span>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-medium uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => isSidebarOpen && toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded transition-all group relative duration-200 text-left",
                      "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon size={18} className={cn("shrink-0", !isSidebarOpen && "mx-auto")} />
                    {isSidebarOpen && (
                      <>
                        <span className="text-xs font-medium flex-1">
                          {item.name}
                        </span>
                        {hasSubItems && (
                          isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
                        )}
                      </>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-medium uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </button>
                )}

                {/* Sub-menu rendering */}
                {isSidebarOpen && hasSubItems && isExpanded && (
                  <div className="pl-9 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subItems?.map(sub => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={cn(
                            "flex items-center gap-2 py-1.5 text-xs transition-colors",
                            isSubActive 
                              ? "text-blue-600 font-bold" 
                              : "text-slate-400 hover:text-slate-900"
                          )}
                        >
                          <sub.icon size={14} className="shrink-0 opacity-60" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          {isSidebarOpen && (
            <div className="bg-slate-50 rounded-md p-4 mb-4 border border-slate-100">
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Carga Operacional</span>
                <span className="text-slate-900">78%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-slate-700 rounded-full"></div>
              </div>
            </div>
          )}
          
          <button 
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded transition-all text-xs font-medium group cursor-pointer",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={18} className="text-red-500 group-hover:text-red-600 transition-colors" />
            {isSidebarOpen && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-50 rounded text-slate-400 transition-all border border-transparent hover:border-slate-100 cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <div className="relative w-full max-w-sm hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar ativos, pesquisadores ou protocolos..." 
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-normal focus:bg-white focus:ring-0 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-md transition-all cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 rounded-lg transition-all">
              <div className="text-right hidden sm:block animate-in fade-in">
                <p className="text-xs font-semibold text-slate-900 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-sm bg-slate-200">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

