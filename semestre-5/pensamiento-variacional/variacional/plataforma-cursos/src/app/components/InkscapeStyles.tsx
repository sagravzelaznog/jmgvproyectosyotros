export default function InkscapeStyles() {
    // This file exists purely to tell Tailwind CSS to not purge these classes,
    // which are injected dynamically from Firebase HTML for the Inkscape course.
    const safelist = [
        // .paso and .ejercicio containers
        "bg-black", "border", "border-gray-800", "p-5", "my-6", "rounded-xl", 
        "shadow-[inset_0_0_15px_rgba(0,255,255,0.05)]", "font-mono", "text-cyan-400", 
        "text-sm", "overflow-hidden", "transform", "hover:scale-[1.01]", "transition-all",
        "border-b", "pb-3", "mb-3", "text-xs", "text-gray-500", "uppercase", 
        "tracking-widest", "flex", "items-center", "gap-2", "w-3", "h-3", 
        "rounded-full", "bg-red-500/80", "bg-yellow-500/80", "bg-green-500/80",
        "bg-gradient-to-br", "from-[#1a0f00]", "to-black", "border-l-4", 
        "border-orange-500", "p-6", "rounded-r-2xl", "shadow-lg", "my-8", "text-orange-400",
        
        // Custom <ul> and <ol> containers for steps
        "flex-col", "gap-2", "my-4", "bg-[#14161c]", "border-l-[3px]", 
        "border-neon-purple/70", "pl-4", "py-3", "text-gray-300", "font-sans", 
        "shadow-sm", "hover:bg-[#1a1c23]", "hover:border-neon-purple", "transition-colors", 
        "rounded-r-md", "gap-3", "my-5", "bg-gradient-to-r", "from-[#101217]", 
        "border-gray-800/80", "p-4", "gap-4", "hover:border-neon-cyan/60", 
        "hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]", "hover:-translate-y-0.5",
        "flex-shrink-0", "bg-[#1a2530]", "text-neon-cyan", "font-black", "w-10", "h-10",
        "justify-center", "border-neon-cyan/40", "shadow-[0_0_10px_rgba(0,255,255,0.2)]",
        "text-base", "flex-1", "items-start"
    ];
    return null;
}
