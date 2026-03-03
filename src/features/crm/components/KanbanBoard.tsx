'use client';

import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  rectIntersection, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Search,
  X,
  History,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { LeadStatus, LeadType } from '@/generated/client';
import { updateLeadStatus, createLead } from '../actions/lead-actions';
import { toast } from 'sonner';
import Link from 'next/link';

// --- Types ---
interface Activity {
  id: string;
  type: string;
  content: string;
  createdAt: Date;
}

interface Lead {
  id: string;
  companyName: string;
  email: string;
  status: LeadStatus;
  type: LeadType;
  priority: number;
  source: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  tags?: string[];
  activities: Activity[];
}

interface Column {
  id: LeadStatus;
  title: string;
  color: string;
}

// --- Card Component ---
function SortableLeadCard({ lead, locale, onClick }: { lead: Lead, locale: string, onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: lead.id,
    data: { type: 'Lead', lead }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={(e) => {
        if (transform) return;
        onClick();
      }}
      className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-amber-500/50 transition-all cursor-grab active:cursor-grabbing group relative mb-3 md:mb-4 last:mb-0"
    >
      <div className="flex justify-between items-start mb-3 pointer-events-none">
        <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-zinc-100 rounded-lg text-[10px] md:text-xs font-bold text-zinc-700 uppercase tracking-tight">
          {lead.type === 'RETAILER' ? <ShoppingBag className="h-3 md:h-3.5 w-3 md:w-3.5" /> : <Users className="h-3 md:h-3.5 w-3 md:w-3.5" />}
          {lead.type}
        </div>
        <div className={`h-2 md:h-2.5 w-2 md:w-2.5 rounded-full ring-2 ring-white ${lead.priority === 3 ? 'bg-red-600' : lead.priority === 2 ? 'bg-amber-500' : 'bg-green-600'}`} />
      </div>

      <h4 className="text-sm md:text-base font-bold text-zinc-950 group-hover:text-amber-800 transition-colors pointer-events-none leading-tight">
        {lead.companyName}
      </h4>
      
      <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-zinc-500 font-medium pointer-events-none">
        <TrendingUp className="h-3.5 md:h-4 w-3.5 md:w-4 text-zinc-400" />
        {lead.source || 'Direct'}
      </div>

      <hr className="my-3 md:my-4 border-zinc-100 pointer-events-none" />

      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
           <div className="w-6 md:w-8 h-6 md:h-8 rounded-lg md:rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-xs md:text-sm font-bold text-amber-800 uppercase">
            {lead.companyName.charAt(0)}
           </div>
           <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-tighter truncate max-w-[80px] md:max-w-[120px]">
             {lead.email.split('@')[0]}
           </span>
        </div>
        
        {lead.activities && lead.activities.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-zinc-600 bg-zinc-50 px-2 md:px-3 py-1 rounded-lg border border-zinc-100">
            <MessageSquare className="h-3 w-3 md:h-3.5 md:w-3.5" />
            {new Date(lead.activities[0].createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Droppable Column ---
function DroppableColumn({ column, leads, locale, onCardClick }: { column: Column, leads: Lead[], locale: string, onCardClick: (lead: Lead) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-[85vw] md:w-[320px] shrink-0">
      <div className="flex items-center justify-between mb-4 md:mb-5 px-3">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${column.color} shadow-sm`}></span>
          <h3 className="font-bold text-zinc-900 text-xs md:text-sm tracking-widest uppercase">{column.title}</h3>
          <span className="bg-zinc-200/50 text-zinc-600 text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-md">
            {leads.length}
          </span>
        </div>
      </div>

      <SortableContext id={column.id} items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div 
          ref={setNodeRef}
          className={`flex-1 rounded-2xl md:rounded-[2rem] p-4 md:p-5 border-2 border-dashed transition-all duration-300 overflow-y-auto min-h-[400px] md:min-h-[500px] ${
            isOver ? 'bg-amber-50 border-amber-400 scale-[1.01]' : 'bg-zinc-100/40 border-zinc-200'
          }`}
        >
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} locale={locale} onClick={() => onCardClick(lead)} />
          ))}
          {leads.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic text-sm py-20 pointer-events-none text-center px-6">
              <Plus className="h-8 w-8 mb-3 opacity-20" />
              Glissez ici
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ initialLeads, locale }: { initialLeads: Lead[], locale: string }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ 
    companyName: '', email: '', type: LeadType.RETAILER, source: '', priority: 1, phoneNumber: '', website: '' 
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns: Column[] = [
    { id: LeadStatus.NEW, title: 'Nouveau', color: 'bg-blue-600' },
    { id: LeadStatus.CONTACTED, title: 'Contacté', color: 'bg-indigo-600' },
    { id: LeadStatus.QUALIFIED, title: 'Qualifié', color: 'bg-amber-600' },
    { id: LeadStatus.PROPOSAL, title: 'Négociation', color: 'bg-purple-600' },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           l.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || l.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [leads, searchQuery, filterType]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);
    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;
    let newStatus: LeadStatus | null = null;
    
    if (columns.some(col => col.id === overId)) {
      newStatus = overId as LeadStatus;
    } else {
      const overLead = leads.find(l => l.id === overId);
      if (overLead) newStatus = overLead.status;
    }

    const currentLead = leads.find(l => l.id === leadId);
    if (currentLead && newStatus && currentLead.status !== newStatus) {
      const oldLeads = [...leads];
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus as LeadStatus } : l));
      const result = await updateLeadStatus(leadId, newStatus);
      if (!result.success) {
        toast.error("Échec de synchronisation");
        setLeads(oldLeads);
      }
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createLead(newLead);
    if (result.success) {
      toast.success("Prospect ajouté !");
      setIsModalOpen(false);
      setNewLead({ companyName: '', email: '', type: LeadType.RETAILER, source: '', priority: 1, phoneNumber: '', website: '' });
      if (result.lead) setLeads(prev => [result.lead as any, ...prev]);
    } else {
      toast.error(result.error || "Erreur lors de l'ajout");
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      
      {/* Header Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-4 md:space-y-6">
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-amber-700 uppercase tracking-widest transition-all w-fit"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Tableau de Bord
          </Link>
          
          <div>
            <h1 className="text-2xl md:text-4xl font-serif font-black text-zinc-950 leading-tight">
              Cloza <span className="text-amber-700 italic border-b-2 md:border-b-4 border-amber-200/50 pb-1">CRM</span>
            </h1>
            <p className="text-sm md:text-lg text-zinc-600 mt-2 font-medium max-w-lg leading-snug">
              Gestion stratégique du pipeline de conversion.
            </p>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-zinc-200/50 rounded-xl w-fit border border-zinc-200 overflow-x-auto max-w-full">
            {['ALL', 'RETAILER', 'VENDOR'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === type ? 'bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                {type === 'ALL' ? 'Tous' : type === 'RETAILER' ? 'Retailers' : 'Vendors'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 md:pl-14 pr-4 md:pr-8 py-3 md:py-4 bg-white border border-zinc-200 rounded-xl md:rounded-[1.5rem] text-sm md:text-base font-bold text-zinc-900 shadow-sm outline-none focus:ring-4 focus:ring-amber-500/10 lg:w-80"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 md:px-10 py-3 md:py-4 bg-zinc-950 text-white rounded-xl md:rounded-[1.5rem] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/20 text-sm md:text-base font-black active:scale-95" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Pipeline Mobile Friendly */}
      <div className="flex gap-4 md:gap-8 h-[calc(100vh-280px)] md:h-[calc(100vh-320px)] overflow-x-auto pb-6 scrollbar-hide px-1">
        {columns.map((column) => (
          <DroppableColumn 
            key={column.id} 
            column={column} 
            leads={filteredLeads.filter(l => l.status === column.id)} 
            locale={locale} 
            onCardClick={setSelectedLead}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl border-2 border-amber-500 scale-105 opacity-95 w-[280px]">
            <h4 className="text-sm md:text-lg font-black text-zinc-950">{activeLead.companyName}</h4>
            <p className="text-[10px] md:text-xs text-zinc-500 mt-1 font-bold">{activeLead.email}</p>
          </div>
        ) : null}
      </DragOverlay>

      {/* --- Drawer Responsive --- */}
      {selectedLead && (
        <div className="fixed inset-0 z-[60] overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full md:max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="h-full flex flex-col">
              <div className="p-6 md:p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl bg-zinc-950 flex items-center justify-center text-white text-xl md:text-3xl font-serif font-black shadow-lg">
                    {selectedLead.companyName.charAt(0)}
                   </div>
                   <div className="min-w-0">
                    <h2 className="text-xl md:text-3xl font-serif font-black text-zinc-950 tracking-tight truncate">{selectedLead.companyName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-black text-zinc-800 uppercase">{selectedLead.type}</span>
                       <span className="text-zinc-300">/</span>
                       <span className="text-[10px] font-black text-amber-700 uppercase">{selectedLead.status}</span>
                    </div>
                   </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-3 hover:bg-zinc-100 rounded-full border border-zinc-200">
                  <X className="h-6 w-6 text-zinc-800" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div className="p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-3xl border border-zinc-200">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2 flex items-center gap-2 italic">
                      <Mail className="h-3 w-3 text-amber-600" /> Email
                    </p>
                    <p className="text-sm md:text-base font-black text-zinc-950 break-all">{selectedLead.email}</p>
                  </div>
                  <div className="p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-3xl border border-zinc-200">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2 flex items-center gap-2 italic">
                      <Phone className="h-3 w-3 text-amber-600" /> Téléphone
                    </p>
                    <p className="text-sm md:text-base font-black text-zinc-950">{selectedLead.phoneNumber || '–'}</p>
                  </div>
                  <div className="p-4 md:p-6 bg-zinc-50 rounded-2xl md:rounded-3xl border border-zinc-200 col-span-1 sm:col-span-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2 flex items-center gap-2 italic">
                      <Globe className="h-3 w-3 text-amber-600" /> Site Internet
                    </p>
                    <p className="text-sm md:text-base font-black text-zinc-950 truncate underline decoration-amber-300">{selectedLead.website || '–'}</p>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <h3 className="font-black text-zinc-950 text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 border-b-2 border-zinc-100 pb-4">
                    <History className="h-4 w-4 text-amber-600" /> Journal
                  </h3>
                  <div className="space-y-6 md:space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-px before:bg-zinc-100">
                    {selectedLead.activities?.map((activity, idx) => (
                      <div key={activity.id} className="relative pl-10">
                        <div className={`absolute left-0 top-1 w-7 h-7 rounded-lg border-2 border-white flex items-center justify-center z-10 ${idx === 0 ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
                           <ChevronRight className="h-4 w-4" />
                        </div>
                        <div className="bg-zinc-50/30 p-4 md:p-5 rounded-xl md:rounded-2xl border border-zinc-100">
                          <p className="text-[9px] font-black text-amber-700 uppercase mb-1">{activity.type}</p>
                          <p className="text-sm text-zinc-800 leading-relaxed font-bold">{activity.content}</p>
                          <p className="text-[9px] text-zinc-400 mt-2 font-bold">{new Date(activity.createdAt).toLocaleDateString(locale)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 border-t border-zinc-100 bg-zinc-50/80">
                 <button className="w-full py-4 md:py-6 bg-zinc-950 text-white rounded-xl md:rounded-[2rem] text-sm md:text-lg font-black shadow-xl flex items-center justify-center gap-3">
                   <MessageSquare className="h-5 w-5" /> WhatsApp
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Responsive --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-lg z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl md:rounded-[3rem] shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] border border-zinc-200">
            <div className="p-6 md:p-10 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl md:text-2xl font-serif font-black text-zinc-950 leading-tight">Nouveau Prospect</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 md:p-10 space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Société</label>
                <input required type="text" value={newLead.companyName} onChange={e => setNewLead({...newLead, companyName: e.target.value})} className="w-full px-5 md:px-6 py-3 md:py-4 bg-zinc-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all text-sm md:text-base font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email Pro</label>
                <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full px-5 md:px-6 py-3 md:py-4 bg-zinc-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all text-sm md:text-base font-bold" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Téléphone</label>
                  <input type="text" value={newLead.phoneNumber} onChange={e => setNewLead({...newLead, phoneNumber: e.target.value})} className="w-full px-5 md:px-6 py-3 md:py-4 bg-zinc-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all text-sm md:text-base font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Urgence</label>
                  <select value={newLead.priority} onChange={e => setNewLead({...newLead, priority: parseInt(e.target.value)})} className="w-full px-5 md:px-6 py-3 md:py-4 bg-zinc-100 rounded-xl md:rounded-2xl outline-none text-sm font-bold">
                    <option value={1}>Basse</option>
                    <option value={2}>Moyenne</option>
                    <option value={3}>Critique</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 md:py-5 bg-zinc-950 text-white rounded-xl md:rounded-3xl font-black shadow-xl mt-4 active:scale-95 text-xs md:text-sm tracking-widest uppercase">
                Valider Prospect
              </button>
            </form>
          </div>
        </div>
      )}
    </DndContext>
  );
}
