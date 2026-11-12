"use client";

import { actions } from "@/lib/siteActions";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Building2, 
  Coffee, 
  Library, 
  Bus,
  Trophy,
  Wifi,
  Stethoscope,
  Info,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

const locations = [
  {
    id: "admin",
    name: "Administration Building",
    category: "Admin",
    description: "Central administrative hub, Vice Chancellor's office, and Registrar's office.",
    coordinates: { x: "45%", y: "40%" },
    icon: Building2
  },
  {
    id: "library",
    name: "Central Library",
    category: "Academic",
    description: "State-of-the-art digital library with over 500,000 volumes and workspace for 2,000 students.",
    coordinates: { x: "60%", y: "35%" },
    icon: Library
  },
  {
    id: "science",
    name: "Faculty of Science & Tech",
    category: "Academic",
    description: "Home to modern laboratories and advanced research centers.",
    coordinates: { x: "35%", y: "55%" },
    icon: Building2
  },
  {
    id: "hall-1",
    name: "Purbasha Student Residence",
    category: "Residential",
    description: "Modern student hostel with 24/7 security and high-speed internet.",
    coordinates: { x: "20%", y: "30%" },
    icon: MapPin
  },
  {
    id: "sports",
    name: "Olympic Sports Complex",
    category: "Recreation",
    description: "Indoor stadium, swimming pool, and multiple athletic fields.",
    coordinates: { x: "75%", y: "65%" },
    icon: Trophy
  },
  {
    id: "medical",
    name: "University Health Center",
    category: "Services",
    description: "Full-service medical clinic providing free healthcare for students and staff.",
    coordinates: { x: "55%", y: "75%" },
    icon: Stethoscope
  },
  {
    id: "cafeteria",
    name: "Central Cafeteria",
    category: "Services",
    description: "Multiple cuisines, nutritional food, and a vibrant student hub.",
    coordinates: { x: "40%", y: "25%" },
    icon: Coffee
  }
];

const categories = ["All", "Academic", "Admin", "Residential", "Recreation", "Services"];

export default function CampusMapPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter(loc => {
    const matchesTab = activeTab === "All" || loc.category === activeTab;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-primary">
        <Image
          src="/campus-hero.png"
          alt="Campus Aerial View"
          fill
          className="object-cover opacity-20 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
              <Navigation size={16} className="text-secondary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Explore NextGen Campus</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight uppercase">
               University <br/>
              <span className="text-secondary font-serif">Campus Map</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
               Navigate your way through our world-class facilities and discover the vibrant heart of digital education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Controls */}
            <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
              <div className="bg-surface rounded-3xl p-8 border border-primary/5 shadow-sm space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search locations..." 
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium text-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === cat 
                          ? "bg-primary text-secondary shadow-lg shadow-primary/20 scale-105" 
                          : "bg-white text-primary/60 hover:bg-white hover:text-primary border border-primary/5"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl transition-all duration-300 group flex items-start gap-4",
                        selectedLocation?.id === loc.id 
                          ? "bg-white shadow-xl ring-1 ring-primary/5 border-l-4 border-secondary translate-x-2" 
                          : "bg-white/50 hover:bg-white hover:shadow-md border border-transparent"
                      )}
                    >
                      <div className={cn(
                        "p-2.5 rounded-xl transition-colors",
                        selectedLocation?.id === loc.id ? "bg-secondary/10 text-secondary" : "bg-primary/5 text-primary/40 group-hover:text-primary"
                      )}>
                        <loc.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary group-hover:text-secondary transition-colors uppercase tracking-tight">{loc.name}</h3>
                        <p className="text-xs font-medium text-text-main/50 line-clamp-1">{loc.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

               {/* Selected Location Info Card */}
               <AnimatePresence mode="wait">
                 {selectedLocation && (
                   <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/30 space-y-6 border border-white/10"
                   >
                     <div className="flex justify-between items-start">
                        <div className="p-4 rounded-2xl bg-white/10 text-secondary">
                           <selectedLocation.icon size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                           {selectedLocation.category}
                        </span>
                     </div>
                     <div className="space-y-3">
                        <h2 className="text-2xl font-black">{selectedLocation.name}</h2>
                        <p className="text-white/70 leading-relaxed text-sm font-medium">{selectedLocation.description}</p>
                     </div>
                     <button onClick={() => actions.external("https://www.google.com/maps/search/?api=1&query=NextGen+University+of+Bangladesh")} className="w-full py-4 bg-secondary text-primary font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300 group">
                        <span className="flex items-center justify-center gap-2">
                           Get Directions <Navigation size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </aside>

            {/* Map Area */}
            <div className="lg:col-span-8 order-1 lg:order-2">
               <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[800px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-surface bg-surface group">
                  <Image
                    src="/campus-map.png"
                    alt="Stylized University Map"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Interactive Pins */}
                  {filteredLocations.map((loc) => (
                    <motion.button
                      key={`pin-${loc.id}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedLocation(loc)}
                      className="absolute z-20 group/pin"
                      style={{ left: loc.coordinates.x, top: loc.coordinates.y }}
                    >
                      <div className={cn(
                        "relative flex items-center justify-center transition-all duration-300",
                        selectedLocation?.id === loc.id ? "scale-125" : ""
                      )}>
                        {/* Pulse effect */}
                        <div className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-75",
                          selectedLocation?.id === loc.id ? "bg-secondary" : "bg-primary"
                        )} />
                        
                        <div className={cn(
                          "relative w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-all",
                          selectedLocation?.id === loc.id ? "bg-secondary text-primary" : "bg-primary text-white"
                        )}>
                          <loc.icon size={16} />
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg opacity-0 scale-90 group-hover/pin:opacity-100 group-hover/pin:scale-100 transition-all pointer-events-none shadow-xl">
                          {loc.name}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary" />
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {/* Overlay for depth */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                  
                  {/* Floating Legend */}
                  <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 hidden sm:block">
                     <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-3">Campus Amenities</p>
                     <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                           <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Wifi size={14} /></div>
                           <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Free WiFi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Bus size={14} /></div>
                           <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Transports</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <div className="p-2 bg-green-50 text-green-500 rounded-lg"><Info size={14} /></div>
                           <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Help Desk</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Quick Info */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center lg:text-left">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-2xl text-secondary mx-auto lg:mx-0">
                    <Navigation size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-primary uppercase">E-Navigation</h3>
                 <p className="text-text-main/60 font-medium leading-relaxed">
                    Scan markers throughout campus with our mobile app for instant location information and indoor navigation.
                 </p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-2xl text-secondary mx-auto lg:mx-0">
                    <History size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-primary uppercase">Guided Tours</h3>
                 <p className="text-text-main/60 font-medium leading-relaxed">
                    Weekly walking tours available for prospective students and visitors. Starting from the Admin building foyer.
                 </p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-2xl text-secondary mx-auto lg:mx-0">
                    <MapPin size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-primary uppercase">Contact Desk</h3>
                 <p className="text-text-main/60 font-medium leading-relaxed">
                    Need help finding a room? Contact our virtual help desk at <strong>+880 1234 56789</strong> or visit any faculty lobby.
                 </p>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
